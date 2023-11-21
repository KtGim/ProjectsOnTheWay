const PAGE_SIZE_INFO = {
    CUS_1: { height: 30, width: 40, id: '3cm*4cm' },
    CUS_2: { height: 40, width: 60, id: '4cm*6cm' },
    CUS_3: { height: 150, width: 100, id: '10cm*15cm' },
    A5: { height: 148, width: 210, id: 'A5' }
};

const paperTypes = {
    'LPN_LABEL': [
        PAGE_SIZE_INFO.CUS_1,
        PAGE_SIZE_INFO.CUS_2
    ],
    'BARCODE_LABEL': [
        PAGE_SIZE_INFO.CUS_1,
        PAGE_SIZE_INFO.CUS_2
    ],
    'SKU_LABEL': [
        PAGE_SIZE_INFO.CUS_1,
        PAGE_SIZE_INFO.CUS_2
    ],
    'LOCATION_LABEL': [
        PAGE_SIZE_INFO.CUS_1,
        PAGE_SIZE_INFO.CUS_2,
        PAGE_SIZE_INFO.CUS_3,
        PAGE_SIZE_INFO.A5
    ]
};

const KEYS_DESCRIPTION = [
    {
        desc: 'keyForSelectAll',
        keys: 'Ctrl + Alt + A'
    },
    {
        desc: 'keyForSave',
        keys: 'Ctrl + Alt + S'
    },
    {
        desc: 'keyForNext',
        keys: 'Ctrl + Y'
    },
    {
        desc: 'keyForRetreat',
        keys: 'Ctrl + Z'
    },
    {
        desc: 'keyForDelete',
        keys: 'Delete'
    }
];

const PAGE_TYPE = {
    RECOMMEND: 'RECOMMEND',
    CUSTOM: 'CUSTOM'
};

export {
    paperTypes,
    PAGE_SIZE_INFO,
    PAGE_TYPE,
    KEYS_DESCRIPTION
};