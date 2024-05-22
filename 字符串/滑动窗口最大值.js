/**
 * 给你一个整数数组 nums，
 * 有一个大小为 k 的滑动窗口从数组的最左侧移动到数组的最右侧。
 * 你只可以看到在滑动窗口内的 k 个数字。滑动窗口每次只向右移动一位。
 *
 * 返回 滑动窗口中的最大值
 *
 *
 * nums = [1,3,-1,-3,5,3,6,7], k = 3
 * [3,3,5,5,6,7]
 *
 * nums = [1], k = 1
 * [1]
 */

var maxSlidingWindow = function (nums, k) {
	let cur = 0;
	const len = nums.length;
	const numsResults = [0];
	while (cur <= len - k) {
		let index = 0;
		for (index; index < k; index++) {
			const curIndex = cur + index;
			numsResults[cur] =
				numsResults[cur] >= nums[curIndex] ? numsResults[cur] : nums[curIndex];
		}
		cur++;
	}
	return numsResults;
};

console.log(maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3));
