/**
 * Function to parse LCOV file manually
 * @param lcovData
 * @param callback
 */
export const lcovFileParser = (
  lcovData: string,
  callback: (err: any, result: any) => void
) => {
  if (!lcovData || typeof lcovData !== 'string') {
    return callback(
      new Error('Invalid LCOV data: input must be a non-empty string'),
      null
    );
  }

  try {
    const records = lcovData
      .split('end_of_record')
      .map((record) => record.trim())
      .filter((record) => record);
    const parsedData = records.map((record) => {
      const lines = record.split('\n');
      const data = {
        file: '',
        lines: { found: 0, hit: 0 },
        branches: { found: 0, hit: 0 },
        functions: { found: 0, hit: 0 },
        statements: { found: 0, hit: 0 },
      };

      lines.forEach((line) => {
        try {
          if (line.startsWith('SF:')) {
            data.file = line.substring(3).trim();
          } else if (line.startsWith('DA:')) {
            const [lineNumber, executionCount] = line.substring(3).split(',');
            if (!executionCount) throw new Error(`Malformed DA line: ${line}`);
            data.statements.found++;
            if (parseInt(executionCount, 10) > 0) {
              data.statements.hit++;
            }
          } else if (line.startsWith('BRDA:')) {
            const parts = line.substring(5).split(',');
            if (parts.length < 4)
              throw new Error(`Malformed BRDA line: ${line}`);
            const executionCount = parts[3];
            data.branches.found++;
            if (parseInt(executionCount, 10) > 0) {
              data.branches.hit++;
            }
          } else if (line.startsWith('FNDA:')) {
            const [executionCount, functionName] = line.substring(5).split(',');
            if (!executionCount || !functionName)
              throw new Error(`Malformed FNDA line: ${line}`);
            data.functions.found++;
            if (parseInt(executionCount, 10) > 0) {
              data.functions.hit++;
            }
          } else if (line.startsWith('LF:')) {
            data.lines.found = parseInt(line.substring(3), 10);
          } else if (line.startsWith('LH:')) {
            data.lines.hit = parseInt(line.substring(3), 10);
          }
        } catch (e) {
          console.warn(
            `Skipped line due to parsing error: ${line}. Error: ${e instanceof Error ? e.message : String(e)}`
          );
        }
      });

      return data;
    });

    callback(null, parsedData);
  } catch (err) {
    callback(
      new Error(
        `Failed to parse LCOV data: ${err instanceof Error ? err.message : String(err)}`
      ),
      null
    );
  }
};
