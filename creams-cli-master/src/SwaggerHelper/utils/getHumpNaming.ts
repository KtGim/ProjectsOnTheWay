/**
 * 返回名称的驼峰表示
 * @param name 
 * @returns string
 */
export default function getName(name: string) {
  return name
      .replace(/\_(\w)/g, (all, letter) => letter.toUpperCase())
          .replace(/\-(\w)/g, (all, letter) => letter.toUpperCase())
              .replace(/\/(\w)/g, (all, letter) => letter.toUpperCase());
}