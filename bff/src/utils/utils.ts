/**
 * 
 * @param str 需要转换的字符串
 * @returns 
 */
export const firstCharUppercase = (str: string) => {
 return str.charAt(0).toUpperCase() + str.substring(1)
}