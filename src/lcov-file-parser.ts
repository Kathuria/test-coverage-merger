/**
 * Function to parse LCOV file manually
 * @param lcovData
 * @param callback
 */
export const lcovFileParser = (lcovData: string, callback: (err: any, result: any) => void) => {
    const records = lcovData.split('end_of_record').map(record => record.trim()).filter(record => record);
    const parsedData = records.map(record => {
        const lines = record.split('\n');
        const data = {
            file: '',
            lines: { found: 0, hit: 0 },
            branches: { found: 0, hit: 0 },
            functions: { found: 0, hit: 0 },
            statements: { found: 0, hit: 0 }
        };

        lines.forEach(line => {
            if (line.startsWith('SF:')) {
                data.file = line.substring(3).trim();
            } else if (line.startsWith('DA:')) {
                data.statements.found++;
                if (parseInt(line.split(',')[1]) > 0) {
                    data.statements.hit++;
                }
            } else if (line.startsWith('BRDA:')) {
                data.branches.found++;
                if (parseInt(line.split(',')[3]) > 0) {
                    data.branches.hit++;
                }
            } else if (line.startsWith('FNDA:')) {
                data.functions.found++;
                if (parseInt(line.split(':')[1].split(',')[0]) > 0) {
                    data.functions.hit++;
                }
            } else if (line.startsWith('LF:')) {
                data.lines.found = parseInt(line.split(':')[1]);
            } else if (line.startsWith('LH:')) {
                data.lines.hit = parseInt(line.split(':')[1]);
            }
        });

        return data;
    });

    callback(null, parsedData);
};
