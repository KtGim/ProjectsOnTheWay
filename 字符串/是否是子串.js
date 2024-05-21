/**
 *给定两个字符串 s和 t ，判断 s是否为 t 的子序列。
  你可以认为 s 和 t 中仅包含英文小写字母。字符串 t 可能会很长（长度n ~= 500,000），而 s 是个短字符串（长度 <=100）。
  字符串的一个子序列是原始字符串删除一些（也可以不删除）字符而不改变剩余字符相对位置形成的新字符串。（例如，"ace"是"abcde"的一个子序列，而"aec"不是）。
  进阶：时间复杂度 

  共两行，第一行为字符串s,  第二行为字符串t
  字符串t的长度 1<=n<=500000
  字符串s的长度 1<=m<=100

  输出true或者是false，true表示是s是t的子序列，false表示s不是t的子序列

  abc
  ahbgdc  --> true

  axc
  ahbgdc  --> false
 */

const isMatch = (s, t) => {
	// let tokens = line.split(' ');
	// let s = parseInt(tokens[0]);
	// let t = parseInt(tokens[1]);

	let sIndex = 0;
	let tIndex = 0;

	var sLen = s.length;
	var tLen = t.length;
	let isMatch = false;
	if (sLen <= tLen) {
		while (tIndex < tLen) {
			if (s[sIndex] == t[tIndex]) {
				if (sIndex == sLen - 1) {
					isMatch = true;
					break;
				} else {
					sIndex++;
				}
			}
			if (isMatch) break;
			tIndex++;
		}
	}

	console.log(isMatch);
	return isMatch;
};

console.log(isMatch('abc', 'ahbgdc'));
