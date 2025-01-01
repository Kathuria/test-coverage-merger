import {mergeLcovReports} from './merge-lcov-reports';
import {lcovFileParser} from './lcov-file-parser';
import {htmlReportGenerator} from './html-report-generator';

const fs = require('fs');
const {promisify} = require('util');
const writeFileSync = promisify(fs.writeFile);

/**
 * Test Coverage Report Merger
 */
export const testCoverageMerger = ({rootPath = 'test-reports', mergedLcovFileName = 'merged-report', outputHtmlFileName = 'final-report', coverageReports = []}: {rootPath?: string, mergedLcovFileName?: string, outputHtmlFileName?: string, coverageReports: Array<string>}) => {
        const outputPath = `${rootPath}/${mergedLcovFileName}.lcov`;

        /** Start with Marking files to merge **/
        mergeLcovReports(coverageReports, outputPath);

        /********************* Generating HTML for Merged Files **************************************/
        const lcovFile = fs.readFileSync(outputPath, 'utf8');

        lcovFileParser(lcovFile, (err: any, lcovData: any) => {
                if (err) {
                        console.error ('Error Parsing LCOV file:', err);
                }

                const generatedHtmlReport = htmlReportGenerator(lcovData, coverageReports);

                writeFileSync(`${rootPath}/${outputHtmlFileName}.html`, generatedHtmlReport)
                .then(() => {
                        console.log('HTML report generated successfully!');
                })
                .catch((error: any) => {
                        console.error ('Error writing HTML report: ', error);
                });
        });

}



