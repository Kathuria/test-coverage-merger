const fs = require('fs');

export const mergeLcovReports = (
  reports: Array<string>,
  outputPath: string
): void => {
  const mergedData = reports
    .map((report: any) => fs.readFileSync(report, 'utf-8'))
    .join('\n');
  fs.writeFileSync(outputPath, mergedData);
};
