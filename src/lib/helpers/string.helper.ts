

/**
 * A function that helps you replace all expressions found in a string.
 * @param str The string need to be enhanced.
 * @param expression The expression you want it to be replaced.
 * @param replacement The replacement of the string.
 */
export const replaceAll = (str: string, expression: string, replacement: string) => {
    while(str.indexOf(expression) !== -1) {
       str = str.replace(expression, replacement);
    }

    return str;
}