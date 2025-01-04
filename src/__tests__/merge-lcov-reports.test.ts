import { mergeLcovReports } from '../merge-lcov-reports';
import * as fs from 'fs';

// Define the reports array with paths to LCOV files
const reports: string[] = [
  './__mocks__/report1.info',
  './__mocks__/report2.info',
];

// Define the output path where the merged report will be saved
const outputPath: string = '/merged.lcov';

// Call the function to merge the LCOV reports
mergeLcovReports(reports, outputPath);

// Mock the file system methods
jest.mock('fs');

describe('mergeLcovReports', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should merge multiple LCOV reports into one', () => {
    const reports = ['report1.lcov', 'report2.lcov'];
    const outputPath = 'merged.lcov';

    // Mock the content of the LCOV reports
    const report1Content = 'TN:\nSF:file1.ts\nDA:1,1\nDA:2,1\nend_of_record';
    const report2Content = 'TN:\nSF:file2.ts\nDA:1,1\nDA:2,0\nend_of_record';

    // Mock the fs.readFileSync method
    (fs.readFileSync as jest.Mock)
      .mockImplementationOnce(() => report1Content)
      .mockImplementationOnce(() => report2Content);

    // Call the function to test
    mergeLcovReports(reports, outputPath);

    // Check that fs.readFileSync was called with the correct arguments
    expect(fs.readFileSync).toHaveBeenCalledWith('report1.lcov', 'utf-8');
    expect(fs.readFileSync).toHaveBeenCalledWith('report2.lcov', 'utf-8');

    // Check that fs.writeFileSync was called with the correct arguments
    const expectedMergedContent = `${report1Content}\n${report2Content}`;
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      outputPath,
      expectedMergedContent
    );
  });

  it('should handle an empty reports array gracefully', () => {
    const reports: string[] = [];
    const outputPath = 'merged.lcov';

    // Call the function to test
    mergeLcovReports(reports, outputPath);

    // Check that fs.writeFileSync was called with an empty string
    expect(fs.writeFileSync).toHaveBeenCalledWith(outputPath, '');
  });
});
