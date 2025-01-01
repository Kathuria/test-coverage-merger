import { lcovFileParser } from '../lcov-file-parser';

describe('lcovFileParser', () => {
  it('should handle empty LCOV data gracefully', (done) => {
    const lcovData = '';

    const expectedOutput: any[] = [];

    lcovFileParser(lcovData, (err, result) => {
      expect(err).toBeNull();
      expect(result).toEqual(expectedOutput);
      done();
    });
  });

  it('should handle malformed LCOV data', (done) => {
    const lcovData = `
      TN:
      SF:file1.ts
      DA:1,1
      DA:2
      BRDA:1,0,0
      FNDA:1,function1
      LF:2
      LH:1
      end_of_record
    `;

    const expectedOutput = [
      {
        file: '',
        lines: { found: 0, hit: 0 },
        branches: { found: 0, hit: 0 },
        functions: { found: 0, hit: 0 },
        statements: { found: 0, hit: 0 },
      },
    ];

    lcovFileParser(lcovData, (err, result) => {
      expect(err).toBeNull();
      expect(result).toEqual(expectedOutput);
      done();
    });
  });
});
