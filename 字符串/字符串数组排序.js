/**
 * AA001A001A01
 * AM001A001A01
 * BD001A001A01
 * BH001A001A01
 * SA001B001A01
 * SA001B001A01
 * SC001A001A01
 * SQ001A001A01
 * SO001A001A01
 * SO002A001
 * SO002A001A01
 * SZ002A001A01
 * ZO001A001A01
 */

const arr = [
	'ZO001A001A01',
	'SO001A001A01',
	'SZ002A001A01',
	'SA001B001A01',
	'SA001A001A01',
	'SC001A001A01',
	'SQ001A001A01',
	'AM001A001A01',
	'AA001A001A01',
	'BH001A001A01',
	'BD001A001A01',
	'SO002A001A01',
	'SO002A001',
];

const getCharType = (char) => {
	return isNaN(char) ? 'string' : 'number';
};

const getSortInfo = (str, startIndex = 0, maxLength) => {
	// console.log(str, startIndex, maxLength);
	let sortIndex = startIndex;
	let char = str[sortIndex];
	let charType = getCharType(char);
	let firstCharType = charType;
	let sortMark = '';
	while (char && charType === firstCharType && sortIndex < maxLength) {
		sortMark = sortMark += char;
		sortIndex++;
		char = str[sortIndex];
		charType = getCharType(char);
	}
	return {
		value: str,
		sortMark,
		sortIndex,
		sortType: firstCharType,
	};
};

const sortFunc = (a, b) => {
	if (a.sortType == 'number' && b.sortType == 'number') {
		return a.sortMark - b.sortMark;
	} else {
		return String(a.sortMark).localeCompare(String(b.sortMark));
	}
};

const sortByChar = (arr, maxLength) => {
	if (!arr || !arr.length) {
		return [];
	}
	if (arr.length === 1) {
		return arr;
	}
	const markList = [];
	const markToArrList = {};
	const sortedArr = arr
		.map(({ value, sortIndex = 0 }) => {
			return getSortInfo(value, sortIndex, maxLength);
		})
		.sort(sortFunc);
	sortedArr.forEach((item) => {
		const { sortMark } = item;
		if (sortMark) {
			if (!markList.includes(sortMark)) {
				markList.push(sortMark);
			}
			if (!markToArrList[sortMark]) {
				markToArrList[sortMark] = [];
			}
			markToArrList[sortMark].push(item);
		}
	});
	if (!markList.length || !markList) {
		return [];
	}
	return markList.reduce((pre, next) => {
		return [...pre, ...sortByChar(markToArrList[next], maxLength)];
	}, []);
};

const sortStrings = (arr) => {
	if (!arr || !arr.length) return [];
	let maxLength = 0;
	const sortArr = [];
	arr.forEach((char) => {
		const len = char.length;
		maxLength = maxLength >= len ? maxLength : len;
		sortArr.push({
			value: char,
			sortIndex: 0,
		});
	});
	const list = sortByChar(sortArr, maxLength);
	return list;
};

sortStrings(arr).forEach((item) => {
	console.log(item.value, item.sortMark, item.sortType, item.sortIndex);
});
