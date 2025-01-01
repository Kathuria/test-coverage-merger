import { testCoverageMerger } from '../index';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { JSDOM } from 'jsdom';

// Promisify the necessary fs functions
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const mkdir = promisify(fs.mkdir);
const unlink = promisify(fs.unlink);
const rmdir = promisify(fs.rmdir);

describe('Integration Test for testCoverageMerger', () => {
  const rootPath = 'test-reports';
  const mergedLcovFileName = 'merged-report';
  const outputHtmlFileName = 'final-report';
  const coverageReports = ['report1.lcov', 'report2.lcov'].map(file => path.join(rootPath, file));

  beforeAll(async () => {
    // Create test directory
    await mkdir(rootPath, { recursive: true });

    // Create sample LCOV report files
    const report1Content = `TN:\nSF:file1.ts\nDA:1,1\nDA:2,0\nend_of_record`;
    const report2Content = `TN:\nSF:file2.ts\nDA:1,1\nDA:2,1\nend_of_record`;

    await writeFile(coverageReports[0], report1Content);
    await writeFile(coverageReports[1], report2Content);
  });

  afterAll(async () => {
    // Clean up files
    for (const file of coverageReports) {
      await unlink(file);
    }
    await unlink(path.join(rootPath, `${mergedLcovFileName}.lcov`));
    await unlink(path.join(rootPath, `${outputHtmlFileName}.html`));
    await rmdir(rootPath);
  });

  it('should merge LCOV reports, parse them, and generate an HTML report', async () => {
    await testCoverageMerger({ rootPath, mergedLcovFileName, outputHtmlFileName, coverageReports });

    // Verify merged LCOV file
    const mergedLcovPath = path.join(rootPath, `${mergedLcovFileName}.lcov`);
    const mergedLcovContent = await readFile(mergedLcovPath, 'utf8');
    expect(mergedLcovContent).toContain('SF:file1.ts');
    expect(mergedLcovContent).toContain('SF:file2.ts');

    // Verify HTML report using JSDOM
    const htmlReportPath = path.join(rootPath, `${outputHtmlFileName}.html`);
    const htmlReportContent = await readFile(htmlReportPath, 'utf8');
    const dom = new JSDOM(htmlReportContent);
    const document = dom.window.document;

    expect(document.querySelector('html')).not.toBeNull();
    expect(document.querySelector('body')).not.toBeNull();
    expect(document.querySelector('h1')?.textContent).toContain('Test Coverage Report');
  });
});
