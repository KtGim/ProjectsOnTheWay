/**
 * https://leetcode.cn/problems/maximum-points-in-an-archery-competition/description/
 * 
 * 思路：
 *  numArrows 总射箭数
 *  12个区间分数递增，所以应该以最小次数占领最多的大分数区域
 *  总分需要大于 Alice 所以需要根据 numArrows 和 总分来进行取舍
 * 
 *  背包问题
 */

/**
 * @param {number} numArrows
 * @param {number[]} aliceArrows
 * @return {number[]}
 */
var maximumBobPoints = function(numArrows, aliceArrows) {
  let dp = Array.from({length: 12}).map(() => new Array(numArrows + 1).fill(0));
  let bobArrows = new Array(12).fill(0);
  
  //动态规划找到可能得到的最大的总分
  for(let i = 1; i <= 11; i++) {
      for(let j = 0; j <= numArrows; j++) {
          if(j > aliceArrows[i]) {
              dp[i][j] = Math.max(dp[i - 1][j], dp[i - 1][j -   aliceArrows[i] - 1] + i);
          } else {
              dp[i][j] = dp[i - 1][j];
          }
      }
  }
  
  //对路径进行还原
  let i = 11, j = numArrows, usedArrows = 0;
  while(i >= 1) {
      if(dp[i][j] !== dp[i - 1][j]) {
          bobArrows[i] = aliceArrows[i] + 1;
          usedArrows += aliceArrows[i] + 1;
          j = j - aliceArrows[i] - 1;
      }
      i = i - 1
  }
  
  //将没用完的箭放入
  if(usedArrows < numArrows) {
      bobArrows[0] = numArrows - usedArrows;
  }
  
  return bobArrows;
};