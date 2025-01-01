import { testCoverageMerger } from '../index';
import { mergeLcovReports } from '../merge-lcov-reports';
import { lcovFileParser } from '../lcov-file-parser';
import { htmlReportGenerator } from '../html-report-generator';
import * as fs from 'fs';
import { promisify } from 'util';

// Mock the file system methods
jest.mock('fs');
jest.mock('../merge-lcov-reports');
jest.mock('../lcov-file-parser');
jest.mock('../html-report-generator');

const writeFileSync = promisify(fs.writeFile) as jest.Mock;
const readFileSync = fs.readFileSync as jest.Mock;

describe('testCoverageMerger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should merge LCOV reports, parse them, and generate an HTML report', async () => {
    const coverageReports = ['report1.lcov', 'report2.lcov'];
    const rootPath = 'test-reports';
    const mergedLcovFileName = 'merged-report';
    const outputHtmlFileName = 'final-report';

    const lcovData = 'TN:\nSF:file1.ts\nDA:1,1\nend_of_record';
    const parsedData = [{ file: 'file1.ts', lines: { found: 1, hit: 1 }, branches: { found: 0, hit: 0 }, functions: { found: 0, hit: 0 }, statements: { found: 1, hit: 1 } }];
    const htmlReport = '<html><body>Test Coverage Report</body></html>';

    // Mock the behavior of dependencies
    (mergeLcovReports as jest.Mock).mockImplementation((reports, outputPath) => {
      expect(reports).toEqual(coverageReports);
      expect(outputPath).toBe(`${rootPath}/${mergedLcovFileName}.lcov`);
    });

    readFileSync.mockReturnValue(lcovData);

    (lcovFileParser as jest.Mock).mockImplementation((data, callback) => {
      expect(data).toBe(lcovData);
      callback(null, parsedData);
    });

    (htmlReportGenerator as jest.Mock).mockReturnValue(htmlReport);

    writeFileSync.mockResolvedValue(undefined);

    // Call the function to test
    await testCoverageMerger({ rootPath, mergedLcovFileName, outputHtmlFileName, coverageReports });

    // Verify the interactions
    expect(mergeLcovReports).toHaveBeenCalled();
    expect(readFileSync).toHaveBeenCalledWith(`${rootPath}/${mergedLcovFileName}.lcov`, 'utf8');
    expect(lcovFileParser).toHaveBeenCalled();
    expect(htmlReportGenerator).toHaveBeenCalledWith(parsedData, coverageReports);
  });

  it('should handle errors during LCOV parsing', async () => {
    const coverageReports = ['report1.lcov'];
    const rootPath = 'test-reports';
    const mergedLcovFileName = 'merged-report';
    const outputHtmlFileName = 'final-report';

    const lcovData = 'TN:\nSF:file1.ts\nDA:1,1\nend_of_record';

    (mergeLcovReports as jest.Mock).mockImplementation((reports, outputPath) => {
      expect(reports).toEqual(coverageReports);
      expect(outputPath).toBe(`${rootPath}/${mergedLcovFileName}.lcov`);
    });

    readFileSync.mockReturnValue(lcovData);

    (lcovFileParser as jest.Mock).mockImplementation((data, callback) => {
      callback(new Error('Parsing error'), null);
    });

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    await testCoverageMerger({ rootPath, mergedLcovFileName, outputHtmlFileName, coverageReports });

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error Parsing LCOV file:', expect.any(Error));

    consoleErrorSpy.mockRestore();
  });
});
