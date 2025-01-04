/**
 * Html Report generator
 * @param lcovData
 * @param coverageReports
 * @returns
 */
export const htmlReportGenerator = (lcovData: any, coverageReports: any) => {
  let linesFound: number = 0,
    linesHit: number = 0,
    branchesFound: number = 0,
    branchesHit: number = 0,
    functionsFound: number = 0,
    functionsHit: number = 0,
    statementsFound: number = 0,
    statementsHit: number = 0;

  if (!lcovData || !coverageReports) {
    return;
  } else {
    lcovData.map((record: any): void => {
      linesFound += record.lines.found || 0;
      linesHit += record.lines.hit || 0;
      branchesFound += record.branches.found || 0;
      branchesHit += record.branches.hit || 0;
      functionsFound += record.functions.found || 0;
      functionsHit += record.functions.hit || 0;
      statementsFound += record.statements.found || 0;
      statementsHit += record.statements.hit || 0;
    });

    const linesPercentage = linesFound
      ? `${((linesHit / linesFound) * 100).toFixed(2)}%`
      : '0%';
    const branchesPercentage = branchesFound
      ? `${((branchesHit / branchesFound) * 100).toFixed(2)}%`
      : '0%';
    const functionsPercentage = functionsFound
      ? `${((functionsHit / functionsFound) * 100).toFixed(2)}%`
      : '0%';
    const statementsPercentage = statementsFound
      ? `${((statementsHit / statementsFound) * 100).toFixed(2)}%`
      : '0%';

    console.log(`
                ================================= Coverage summary ========================
                Merged Coverage : ${linesPercentage} (${linesHit} / ${linesFound})}
                ===========================================================================
                Lines           : ${linesPercentage} (${linesHit} / ${linesFound})
                Branches        : ${branchesPercentage} (${branchesHit} / ${branchesFound})
                Functions       : ${functionsPercentage} (${functionsHit} / ${functionsFound})
                
                ===========================================================================
                `);

    return `
                <!doctype html>
                <html Lang="en">
                        <head>
                                <title>Merged Test Coverage</title>
                                <meta charset="utf-8" />
                                <meta name="viewport" content="width=device-width, initial-scale=1" />
                        </head>
                        <body>
                                <div class='wrapper'>
                                <h1>Test Coverage Report</h1>
                                <details>
                                        <summary>
                                                <p style="display: inline-block; cursor: pointer">
                                                        <u>Packages Covered For Merging Report</u>
                                                </p>
                                        </summary>
                                        <ul>
                                                ${coverageReports.map((rpt: any) => `<li>${rpt}</li>`)}
                                        </uL>
                                </details>
                                <br/>
                                <div>
                                        <div>
                                                <span>${linesPercentage} </span>
                                                <span>Lines</span>
                                                <span>(${linesHit} / ${linesFound})</span>
                                        </div>
                
                                        <div>
                                                <span>${branchesPercentage} </spans
                                                <span>Branches</span>
                                                <span> (${branchesHit} / ${branchesFound})</span>
                                        </div>
                
                                        <div>
                                                <span>${functionsPercentage} </span>
                                                <span>Functions</span> 
                                                <span>(${functionsHit} / ${functionsFound})</span>
                                        </div>
                                        
                                        <div>
                                                <span>${statementsPercentage} </span>
                                                <span>Statements</span>
                                                <span>(${statementsHit} / ${statementsFound})</span>
                                        </div>
                                </div>
                                <table>
                                        <tr>
                                                <th>File</th>
                                                <th>Lines</th>
                                                <th>Covered</th>
                                                <th>Percentage</th>
                                        </tr>
                                        ${lcovData
                                          .map(
                                            (record: any) => `
                                        <tr>
                                                <td>${record.file}</td>
                                                <td>${record.lines.found}</td> 
                                                <td>${record.lines.hit}</td>
                                                <td>${record.lines.hit ? ((record.lines.hit / record.lines.found) * 100).toFixed(2) : 0} %</td> 
                                        </tr>
                                        `
                                          )
                                          .join('')}
                                </table>
                                </div>
                        </body>
                </html>`;
  }
};
