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

const PAGE_SIZE_INFO = {
    CUS_1: { width: 30, height: 40, id: '3040' },
    CUS_2: { width: 40, height: 60, id: '4060' },
    CUS_3: { width: 100, height: 150, id: '100150' },
    A5: { width: 148, height: 210, id: 'A5' }
};

export {
    paperTypes,
    PAGE_SIZE_INFO
};