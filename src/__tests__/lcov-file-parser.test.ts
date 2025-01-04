import { lcovFileParser } from '../lcov-file-parser';

describe('lcovFileParser', () => {
  it('should parse a valid LCOV file with multiple records', (done) => {
    const lcovData = `
SF:/path/to/file1.js
DA:1,1
DA:2,0
BRDA:1,0,0,1
BRDA:1,0,1,0
LF:2
LH:1
end_of_record
SF:/path/to/file2.js
DA:3,1
DA:4,1
LF:2
LH:2
end_of_record`;

    lcovFileParser(lcovData, (err, result) => {
      expect(err).toBeNull();
      expect(result).toEqual([
        {
          file: '/path/to/file1.js',
          lines: { found: 2, hit: 1 },
          branches: { found: 2, hit: 1 },
          functions: { found: 0, hit: 0 },
          statements: { found: 2, hit: 1 },
        },
        {
          file: '/path/to/file2.js',
          lines: { found: 2, hit: 2 },
          branches: { found: 0, hit: 0 },
          functions: { found: 0, hit: 0 },
          statements: { found: 2, hit: 2 },
        },
      ]);
      done();
    });
  });

  it('should parse a single record LCOV file correctly', (done) => {
    const lcovData = `
SF:/path/to/single_file.js
DA:1,2
DA:2,0
LF:2
LH:1
FN:9,(anonymous_0)
FN:10,(anonymous_1)
FN:12,App
FNF:3
FNH:0
FNDA:1,(anonymous_0)
FNDA:0,(anonymous_1)
FNDA:0,App
end_of_record`;

    lcovFileParser(lcovData, (err, result) => {
      expect(err).toBeNull();
      expect(result).toEqual([
        {
          file: '/path/to/single_file.js',
          lines: { found: 2, hit: 1 },
          branches: { found: 0, hit: 0 },
          functions: { found: 3, hit: 1 },
          statements: { found: 2, hit: 1 },
        },
      ]);
      done();
    });
  });

  it('should handle LCOV data with missing fields gracefully', (done) => {
    const lcovData = `
SF:/path/to/file.js
DA:1,1
LF:1
end_of_record`;

    lcovFileParser(lcovData, (err, result) => {
      expect(err).toBeNull();
      expect(result).toEqual([
        {
          file: '/path/to/file.js',
          lines: { found: 1, hit: 0 },
          branches: { found: 0, hit: 0 },
          functions: { found: 0, hit: 0 },
          statements: { found: 1, hit: 1 },
        },
      ]);
      done();
    });
  });

  it('should handle invalid LCOV data gracefully', (done) => {
    const lcovData = `
SF:
DA:1,
BRDA:1,0,0
FNDA:abc
end_of_record`;

    lcovFileParser(lcovData, (err, result) => {
      expect(err).toBeNull();
      expect(result).toEqual([
        {
          file: '',
          lines: { found: 0, hit: 0 },
          branches: { found: 0, hit: 0 },
          functions: { found: 0, hit: 0 },
          statements: { found: 0, hit: 0 },
        },
      ]);
      done();
    });
  });

  it('should handle completely empty LCOV data', (done) => {
    const lcovData = '';

    lcovFileParser(lcovData, (err, result) => {
      expect(err).not.toBeNull();
      expect(result).toEqual(null);
      done();
    });
  });

  it('should throw an error for malformed LCOV data', (done) => {
    const lcovData = `
SF:/path/to/file.js
DA:1`;

    lcovFileParser(lcovData, (err, result) => {
      expect(err).toBeInstanceOf(Error);
      expect(err?.message).toContain('Failed to parse LCOV data');
      expect(result).toBeNull();
      done();
    });
  });

  it('should handle records with unrecognized lines gracefully', (done) => {
    const lcovData = `
SF:/path/to/file.js
UNKNOWN:123
DA:1,1
LF:1
end_of_record`;

    lcovFileParser(lcovData, (err, result) => {
      expect(err).toBeNull();
      expect(result).toEqual([
        {
          file: '/path/to/file.js',
          lines: { found: 1, hit: 0 },
          branches: { found: 0, hit: 0 },
          functions: { found: 0, hit: 0 },
          statements: { found: 1, hit: 1 },
        },
      ]);
      done();
    });
  });
});
