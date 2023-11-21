import { STYLE_ITEMS } from './components/OperationBar/const';
import { UNIT } from './const';

/**
 * sku lpn 库存的尺寸
 * 单位 mm
 */
const lpnSkuLocSizeList = [
    {
        width: 20,
        height: 30,
        key: '20*30'
    },
    {
        width: 30,
        height: 40,
        key: '30*40'
    },
    {
        width: 30,
        height: 50,
        key: '30*50'
    },
    {
        width: 30,
        height: 70,
        key: '30*70'
    },
    {
        width: 40,
        height: 60,
        key: '40*60'
    },
    {
        width: 40,
        height: 70,
        key: '40*70'
    },
    {
        width: 40,
        height: 80,
        key: '40*80'
    },
    {
        width: 50,
        height: 80,
        key: '50*80'
    },
    {
        width: 50,
        height: 100,
        key: '50*100'
    },
    {
        width: 100,
        height: 150,
        key: '100*150'
    }
];
/**
 * 其他面单尺寸
 */
const labelSizeList = [
    {
        width: 100,
        height: 150,
        key: '100*150'
    },
    {
        width: 100,
        height: 100,
        key: '100*100'
    },
    {
        width: 210,
        height: 297,
        key: 'A4'
    }
];

const DPI_TYPE = {
    X: 'x',
    Y: 'y'
};

const getDpi = () => {
    const dpi = {};
    return () => {
        if(!dpi.x || !dpi.y) {
            const tmpNode = document.createElement('DIV');
            tmpNode.style.cssText = 'width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:-99;';
            document.body.appendChild(tmpNode);
            dpi.x = parseInt(tmpNode.offsetWidth);
            dpi.y = parseInt(tmpNode.offsetHeight);
            tmpNode.parentNode.removeChild(tmpNode);
        }
        return dpi;
    };
};

const dpi = getDpi()();

/**
 * 绝对长度转换
 *  1in = 72pt
 *  1in = 25.4 mm = 72pt
 *  1mm = 72pt / 25.4 = 2.834645669pt
 *
 *  pt和px的换算公式可以根据pt的定义得出:
 *      pt = 1/72(英寸)
 *      px = 1/dpi(英寸)
 *      pt = px * dpi / 72
 *
 *  例子：
 *      以 Windows 下的 96dpi 来计算
 *      pt = px * 96/72 = px * 4/3 = px * 1.33
 *      1pt = 1.33px
 *      1px = 0.75pt
 *
 * MM -> PX
 *  pt = px * dpi / 72
 *  1in = 25.4mm = 72pt
 *  25.4mm/72 = px * dpi / 72
 *  mm = px * dpi / 25.4
 *  例子：
 *      以 Windows 下的 96dpi 来计算
 *      mm = px * 96 / 25.4
 *      1mm = 3.78px
 *
 * @param {number} px 分辨率
 * @param {string} type DPI_TYPE  横轴或者纵轴
 * @returns {number} mm
 */
const px2mm = (px = 1, type = DPI_TYPE.X) => {
    return  +(((25.4 * px) / (dpi[type] || 1)).toFixed(2));
};

/**
 * 获取对象的属性值
 * @param {*} mm
 * @param {string} type DPI_TYPE  横轴或者纵轴
 * @returns {number} px
 */
const mm2px = (mm = 1, type = DPI_TYPE.X) => {
    return +(((mm / 25.4) * (dpi[type] || 1)).toFixed(2));
};

// 1in = 72 pt = 25.4mm = 96px
const px2in = (px = 1) => {
    // 打印机尺寸需要 * 96， in/96
    // 打印机只能接受整数
    return Math.ceil(px);
};

const getSize = ({
    width = 1,
    height = 1,
    unit = UNIT.MM
}) => {
    if(unit == UNIT.MM) {
        return {
            width: px2mm(width),
            height: px2mm(height)
        };
    } else if (unit == UNIT.PX) {
        return {
            width: mm2px(width),
            height: mm2px(height)
        };
    }
};

const getSizeValue = (
    size,
    unit = UNIT.MM,
    type = DPI_TYPE.X
) => {
    if(unit == UNIT.MM) {
        return px2mm(size, type);
    } else if (unit == UNIT.PX) {
        return mm2px(size, type);
    }
};

const CSSPROP2DPI = {
    [STYLE_ITEMS.WIDTH]: DPI_TYPE.X,
    [STYLE_ITEMS.HEIGHT]: DPI_TYPE.Y
};

export {
    lpnSkuLocSizeList,
    labelSizeList,

    getSize,
    getSizeValue,

    px2mm,
    mm2px,

    px2in,

    DPI_TYPE,
    CSSPROP2DPI
};