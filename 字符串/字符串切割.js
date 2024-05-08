/**
 * 给定一个非空字符串S，其被N个‘-’分隔成N+1的子串，给定正整数K，要求除第一个子串外，
 * 其余的子串每K个字符组成新的子串，并用‘-’分隔。对于新组成的每一个子串，
 * 如果它含有的小写字母比大写字母多，则将这个子串的所有大写字母转换为小写字母；
 * 反之，如果它含有的大写字母比小写字母多，则将这个子串的所有小写字母转换为大写字母；
 * 大小写字母的数量相等时，不做转换。
    输入描述:
    输入为两行，第一行为参数K，第二行为字符串S。
    输出描述:
    输出转换后的字符串。
    示例1
    输入
    3
    12abc-abCABc-4aB@
    输出
    12abc-abc-ABC-4aB-@
    说明
    子串为12abc、abCABc、4aB@，第一个子串保留，后面的子串每3个字符一组为abC、ABc、4aB、@，abC中小写字母较多，转换为abc，
    ABc中大写字母较多，转换为ABC，4aB中大小写字母都为1个，不做转换，@中没有字母，连起来即12abc-abc-ABC-4aB-@
    示例2
    输入
    12
    12abc-abCABc-4aB@
    输出
    12abc-abCABc4aB@
    说明
    子串为12abc、abCABc、4aB@，第一个子串保留，后面的子串每12个字符一组为abCABc4aB@，这个子串中大小写字母都为4个，不做转换，
    连起来即12abc-abCABc4aB@

    作者：yaozi
    链接：https://leetcode.cn/circle/discuss/niKSMZ/
    来源：力扣（LeetCode）
    著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
 */

/**
 * 
 * 大写字母 65-90；小写 97-122
 * 
 * 思路： 
 *  将数组打平，循环遍历数组
 *  保存每一个字母拼接成字符串，并计算一个 m 中的大小写个数的偏向，upperOrLower
 *  每次计算到 m 就进行字符串拼接和大小写转换
 *  遍历完数组，将最后一组不足 m 个数的字符串拼接起来
 *  返回并输出字符串
 *  TODO:
 *    1. 计算大小姐个数时，如果计算的总数大于 m / 2 可以直接停止遍历进入下一个循环
 *    2. 结束时，如果剩余字符串长度不足可以直接结束便利，但此时大小写任然需要遍历，结合 1 的优化，可以减少剩余遍历次数
 * @param {*} str 
 * @param {*} m 
 */
const transverseChars = (str, m) => {
  if(!str) return '';
  const charList = str.split('-');
  const resetChars = charList.slice(1).reduce((pre, next) => {
    return [
      ...pre,
      ...next
    ];
  }, []);
  let returnChar = charList[0];
  let curChar = '';
  let curSplitChar = '';
  let upperOrLower = 0;
  let n = 0;
  // todo: 处理 m/2 的逻辑，减少计算量
  console.log(resetChars);
  while(resetChars.length) {
    curChar = resetChars.shift();
    if(n < m) {
      curSplitChar += curChar;
    } else {
      console.log(curSplitChar, 'curSplitChar')
      returnChar = transfer(upperOrLower, returnChar, curSplitChar);
      // 重新赋值
      curSplitChar = curChar;
      upperOrLower = 0;
      n = 0;
    }
    upperOrLower += locAt(curChar);
    console.log(upperOrLower, 'upperOrLower', returnChar)
    n ++;
  }

  if(n > 0) {
    returnChar = transfer(upperOrLower, returnChar, curSplitChar);;
  }
  return returnChar;
}

const transfer = (upperOrLower, curChar, curSplitChar) => {
  let returnChar = curChar;
  if(upperOrLower > 0) { // 大写
    returnChar += ('-' + curSplitChar.toUpperCase());
  } else if(upperOrLower < 0) { //小写
    returnChar += ('-' + curSplitChar.toLowerCase());
  } else {
    returnChar += ('-' + curSplitChar);
  }
  return returnChar;
}

const locAt = (char) => {
  const asciiCode = char.charCodeAt();
  console.log(asciiCode, 'asciiCode')
  if(asciiCode >= 65 && asciiCode <= 90) {
    return 1;
  } else if (asciiCode >= 97 && asciiCode <= 122) {
    return -1;
  } else {
    return 0;
  }
}