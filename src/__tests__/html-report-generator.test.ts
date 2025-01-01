import { htmlReportGenerator } from '../html-report-generator';
import { JSDOM } from 'jsdom';

describe('htmlReportGenerator', () => {
  it('should handle empty lcovData gracefully', () => {
    const lcovData: any[] = [];
    const coverageReports: any[] = [];

    const result = htmlReportGenerator(lcovData, coverageReports);

    // Use jsdom to parse the HTML string
    const dom = new JSDOM(result);
    const document = dom.window.document;

    // Check for the presence of the main elements
    expect(document.querySelector('h1')?.textContent).toBe('Test Coverage Report');
    expect(document.querySelector('ul')?.children.length).toBe(0); // No list items should be present
  });

  it('should calculate percentages correctly', () => {
    const lcovData = [
      {
        file: 'file2.ts',
        lines: { found: 20, hit: 10 },
        branches: { found: 10, hit: 5 },
        functions: { found: 4, hit: 2 },
        statements: { found: 25, hit: 20 },
      },
    ];

    const coverageReports = ['file2.ts'];

    const result = htmlReportGenerator(lcovData, coverageReports);

    // Use jsdom to parse the HTML string
    const dom = new JSDOM(result);
    const document = dom.window.document;

    // Validate the percentage and counts in the HTML
    const linesDiv = document.querySelector('div > div:nth-child(1)');
    expect(linesDiv?.textContent).toContain('50.00%');
    expect(linesDiv?.textContent).toContain('Lines');
    expect(linesDiv?.textContent).toContain('(10 / 20)');

    const branchesDiv = document.querySelector('div > div:nth-child(2)');
    expect(branchesDiv?.textContent).toContain('50.00%');
    expect(branchesDiv?.textContent).toContain('Branches');
    expect(branchesDiv?.textContent).toContain('(5 / 10)');

    const functionsDiv = document.querySelector('div > div:nth-child(3)');
    expect(functionsDiv?.textContent).toContain('50.00%');
    expect(functionsDiv?.textContent).toContain('Functions');
    expect(functionsDiv?.textContent).toContain('(2 / 4)');

    const statementsDiv = document.querySelector('div > div:nth-child(4)');
    expect(statementsDiv?.textContent).toContain('80.00%');
    expect(statementsDiv?.textContent).toContain('Statements');
    expect(statementsDiv?.textContent).toContain('(20 / 25)');
  });
});
