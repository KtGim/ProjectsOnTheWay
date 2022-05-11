import React from 'react';
import { Select } from 'antd';

import '../index.less';
const Option = Select.Option;

interface CountrySelectorProps {
    handleChange: () => void,
    lan: LANGUAGE
}

class CountrySelector extends React.PureComponent<CountrySelectorProps> {
    render () {
        const {
            handleChange,
            lan
        } = this.props;
        return (
            <div className="country-language" title={LOCAL_LANGUAGE[lan]}>
                <Select value={lan} className="country-img-style" onChange={handleChange} dropdownMatchSelectWidth={false}>
                    {Object.values(flagType).map((language)  => {
                        return (
                            <Option value={language} key={language} title={LOCAL_LANGUAGE[language as LANGUAGE]}>
                                <span className={`flag-icon flag-icon-${flagType[language as LANGUAGE]}`} />
                            </Option>
                        );
                    })}
                </Select>
            </div>
        );
    }
}

export default CountrySelector;

enum LANGUAGE {
    EN_US = 'en_US',
	ZH_CN = 'zh_CN',
	EN_TH = 'en_TH',
	TH_TH = 'th_TH',
	VI_VN = 'vi_VN',
	SPANISH = 'spanish',
	INDONESIAN = 'indonesian',
	FRENCH = 'french',
	GERMAN = 'german',
	PORTUGUESE = 'portuguese',
	JAPANESE = 'japanese',
	FILIPINO = 'filipino'
};

type FLAG_TYPE = {
    [key in LANGUAGE]: string
}

type LOCAL_LANGUAGE_TYPE = {
    [key in LANGUAGE]: string
}

const flagType: FLAG_TYPE = {
    [LANGUAGE.ZH_CN]: 'cn',
    [LANGUAGE.EN_US]: 'us',
    [LANGUAGE.EN_TH]: 'gb',
    [LANGUAGE.TH_TH]: 'th',
    [LANGUAGE.VI_VN]: 'vn',
    [LANGUAGE.SPANISH]: 'es',
    [LANGUAGE.INDONESIAN]: 'id',
    [LANGUAGE.FRENCH]: 'fr',
    [LANGUAGE.GERMAN]: 'de',
    [LANGUAGE.PORTUGUESE]: 'pt',
    [LANGUAGE.JAPANESE]: 'jp',
    [LANGUAGE.FILIPINO]: 'ph'
};

const LOCAL_LANGUAGE: LOCAL_LANGUAGE_TYPE = {
    [LANGUAGE.EN_US]: 'English(US)',
    [LANGUAGE.ZH_CN]: '中文',
    [LANGUAGE.EN_TH]: 'English(TH)',
    [LANGUAGE.TH_TH]: 'ไทย',
    [LANGUAGE.VI_VN]: 'Tiếng Việt',
    [LANGUAGE.SPANISH]: 'español',
    [LANGUAGE.INDONESIAN]: 'Bahasa indonesia',
    [LANGUAGE.FRENCH]: 'En français',
    [LANGUAGE.GERMAN]: 'Das ist Deutsch.',
    [LANGUAGE.PORTUGUESE]: 'Língua portuguesa português',
    [LANGUAGE.JAPANESE]: '日本語',
    [LANGUAGE.FILIPINO]: 'Filipino'
};

export  {
    LANGUAGE,
    LOCAL_LANGUAGE_TYPE,
    FLAG_TYPE,

    LOCAL_LANGUAGE,
    flagType
}