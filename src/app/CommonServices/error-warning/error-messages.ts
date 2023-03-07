import { ErrorMessage } from "./messageinterface";

export const ERRORMESSAGE: ErrorMessage[] = [
    {
        errorcode: 1,
        errormessage: 'Flow Per Module should not be less than',
        type: 'error',
        page: 'moduleselection',
        language: 'en'
    },
    {
        errorcode: 1,
        errormessage: '每台膜堆的流量不应高于',
        type: 'error',
        page: 'moduleselection',
        language: 'zh'
    },

    {
        errorcode: 1,
        errormessage: '모듈당 유량 이 초과하지 않아야 합니다.',
        type: 'error',
        page: 'moduleselection',
        language: 'ko'
    },
    {
        errorcode: 1,
        errormessage: 'Поток через модуль не должен быть менее чем ',
        type: 'error',
        page: 'moduleselection',
        language: 'ru'
    },
    {
        errorcode: 1,
        errormessage: 'El flujo por módulo no debe exceder',
        type: 'error',
        page: 'moduleselection',
        language: 'es'
    },

    {
        errorcode: 2,
        errormessage: 'Flow Per Module should not exceed',
        type: 'error',
        page: 'moduleselection',
        language: 'en'
    },
    {
        errorcode: 2,
        errormessage: '每台膜堆的流量不应高于',
        type: 'error',
        page: 'moduleselection',
        language: 'zh'
    },

    {
        errorcode: 2,
        errormessage: '모듈당 유량 이 초과하지 않아야 합니다.',
        type: 'error',
        page: 'moduleselection',
        language: 'ko'
    },
    {
        errorcode: 2,
        errormessage: 'Поток через модуль не должен быть менее чем',
        type: 'error',
        page: 'moduleselection',
        language: 'ru'
    },
    {
        errorcode: 2,
        errormessage: 'El flujo por módulo no debe exceder',
        type: 'error',
        page: 'moduleselection',
        language: 'es'
    },

    {
        errorcode: 3,
        errormessage: 'Temperature must be greater than 20 °C and less than or equal to 45 °C',
        type: 'error',
        page: 'moduleselection',
        language: 'en'
    },
    {
        errorcode: 3,
        errormessage: '温度必须高于 20oC，低于或等于 45oC',
        type: 'error',
        page: 'moduleselection',
        language: 'zh'
    },

    {
        errorcode: 3,
        errormessage: '온도는 20 °C보다 더 높아야만 하며, 45 °C보다 같거나 또는 낮아야 합니다.',
        type: 'error',
        page: 'moduleselection',
        language: 'ko'
    },
    {
        errorcode: 3,
        errormessage: 'Температура должна быть не меньше 20 °C и не больше 45 °C',
        type: 'error',
        page: 'moduleselection',
        language: 'ru'
    },
    {
        errorcode: 3,
        errormessage: 'La temperatura debe ser mayor a 20°C y menor o igual a 45°C',
        type: 'error',
        page: 'moduleselection',
        language: 'es'
    },

    {
        errorcode: 4,
        errormessage: 'Caution: Select LX-HI module for higher temperature',
        type: 'error',
        page: 'moduleselection',
        language: 'en'
    },
    {
        errorcode: 4,
        errormessage: '警告：对于高温应用，请选择 LX-HI 膜堆',
        type: 'error',
        page: 'moduleselection',
        language: 'zh'
    },

    {
        errorcode: 4,
        errormessage: '주의 : 높은 온도를 위해서는 LX-HI를 선택해주세요',
        type: 'error',
        page: 'moduleselection',
        language: 'ko'
    },
    {
        errorcode: 4,
        errormessage: 'Предупреждение: выберите модуль LX-HI при высокой температуре воды',
        type: 'error',
        page: 'moduleselection',
        language: 'ru'
    },
    {
        errorcode: 4,
        errormessage: 'Precaución: Seleccione el módulo LX-HI para temperatura más alta',
        type: 'error',
        page: 'moduleselection',
        language: 'es'
    },
    {
        errorcode: 5,
        errormessage: 'Temperature must be within 68 °F to 113 °F for modules other than LX-HI',
        type: 'error',
        page: 'moduleselection',
        language: 'en'
    },
    {
        errorcode: 5,
        errormessage: '除了LX-HI 膜堆，温度必须介于 68oF 和 113oF 之间',
        type: 'error',
        page: 'moduleselection',
        language: 'zh'
    },

    {
        errorcode: 5,
        errormessage: 'LX-HI이외의 모듈은 68 °F to 113 °F 이내여야 합니다.',
        type: 'error',
        page: 'moduleselection',
        language: 'ko'
    },
    {
        errorcode: 5,
        errormessage: 'Температура должна быть в диапазоне от 68 °F до 113 °F для всех модулей кроме LX-HI',
        type: 'error',
        page: 'moduleselection',
        language: 'ru'
    },
    {
        errorcode: 5,
        errormessage: 'La temperatura debe estar entre 68 - 113°F para módulos que no sean LX - HI',
        type: 'error',
        page: 'moduleselection',
        language: 'es'
    },


    {
        errorcode: 6,
        errormessage: 'Temperature must be within 5 °C to 60 °C',
        type: 'error',
        page: 'moduleselection',
        language: 'en'
    },
    {
        errorcode: 6,
        errormessage: '温度必须介于 5oC 和 60oC 之间',
        type: 'error',
        page: 'moduleselection',
        language: 'zh'
    },

    {
        errorcode: 6,
        errormessage: '온도는 20 °C보다 더 높아야만 하며, 45 °C보다 같거나 또는 낮아야 합니다.',
        type: 'error',
        page: 'moduleselection',
        language: 'ko'
    },
    {
        errorcode: 6,
        errormessage: 'Температура должна быть в диапазоне от 5 °C до 60 °C',
        type: 'error',
        page: 'moduleselection',
        language: 'ru'
    },


    {
        errorcode: 7,
        errormessage: 'Temperature must be within 41 °F to 140  °F',
        type: 'error',
        page: 'moduleselection',
        language: 'en'
    },
    {
        errorcode: 7,
        errormessage: '温度必须介于 41oF 和 140oF 之间',
        type: 'error',
        page: 'moduleselection',
        language: 'zh'
    },

    {
        errorcode: 7,
        errormessage: '온도는 41 °F에서 140  °F 이내여야 합니다. ',
        type: 'error',
        page: 'moduleselection',
        language: 'ko'
    },
    {
        errorcode: 7,
        errormessage: 'Температура должна быть в диапазоне от 41 °F до 140 °F',
        type: 'error',
        page: 'moduleselection',
        language: 'ru'
    },
    {
        errorcode: 7,
        errormessage: '"La temperatura debe estar entre 41-140°F',
        type: 'error',
        page: 'moduleselection',
        language: 'es'
    },


    {
        errorcode: 8,
        errormessage: 'Voltage maybe limited due to low temperature. 10 C recommended',
        type: 'error',
        page: 'moduleselection',
        language: 'en'
    },
    {
        errorcode: 8,
        errormessage: '电压可能由于温度低而受限。推荐 10oC。',
        type: 'error',
        page: 'moduleselection',
        language: 'zh'
    },

    {
        errorcode: 8,
        errormessage: '전압은 낮은 온도때문에 제한되어야 합니다. 10 °C가 권고됨',
        type: 'error',
        page: 'moduleselection',
        language: 'ko'
    },
    {
        errorcode: 8,
        errormessage: 'Напряжение может быть ограничено из-за низкой температуры. Рекомендуемая температура 10 °C',
        type: 'error',
        page: 'moduleselection',
        language: 'ru'
    },
    {
        errorcode: 8,
        errormessage: 'El Voltaje puede limitarse debido a la baja temperatura. Se recomiendan 10°C',
        type: 'error',
        page: 'moduleselection',
        language: 'es'
    },
    {
        errorcode: 9,
        errormessage: 'Voltage maybe limited due to low temperature. 50 F recommended',
        type: 'error',
        page: 'moduleselection',
        language: 'en'
    },
    {
        errorcode: 9,
        errormessage: '电压可能由于温度低而受限。推荐 50oF。',
        type: 'error',
        page: 'moduleselection',
        language: 'zh'
    },

    {
        errorcode: 9,
        errormessage: '전압은 낮은 온도때문에 제한되어야 합니다. 50 °F 가 권고됨',
        type: 'error',
        page: 'moduleselection',
        language: 'ko'
    },
    {
        errorcode: 9,
        errormessage: 'Напряжение может быть ограничено из-за низкой температуры. Рекомендуемая температура 50 °F',
        type: 'error',
        page: 'moduleselection',
        language: 'ru'
    },
    {
        errorcode: 9,
        errormessage: 'El Voltaje puede limitarse debido a la baja temperatura. Se recomiendan 50°F"',
        type: 'error',
        page: 'moduleselection',
        language: 'es'
    },

    {
        errorcode: 10,
        errormessage: 'Temperature must be within 5 °C to 45 °C',
        type: 'error',
        page: 'moduleselection',
        language: 'en'
    },
    {
        errorcode: 10,
        errormessage: '温度必须介于 5oC 和 45oC 之间',
        type: 'error',
        page: 'moduleselection',
        language: 'zh'
    },

    {
        errorcode: 10,
        errormessage: '온도는 5 °C 에서  45 °C 이내여야 합니다.',
        type: 'error',
        page: 'moduleselection',
        language: 'ko'
    },
    {
        errorcode: 10,
        errormessage: 'Температура должна быть в диапазоне от 5 °C до 45 °C',
        type: 'error',
        page: 'moduleselection',
        language: 'ru'
    },
    {
        errorcode: 10,
        errormessage: 'La temperatura debe estar entre 5-45°C',
        type: 'error',
        page: 'moduleselection',
        language: 'es'
    },

    {
        errorcode: 11,
        errormessage: 'Temperature must be within 41 °F to 113  °F',
        type: 'error',
        page: 'moduleselection',
        language: 'en'
    },
    {
        errorcode: 11,
        errormessage: '温度必须介于 41oF 和 113oF 之间',
        type: 'error',
        page: 'moduleselection',
        language: 'zh'
    },

    {
        errorcode: 11,
        errormessage: '온도는 41 °F 에서  113 °F 이내여야 합니다.',
        type: 'error',
        page: 'moduleselection',
        language: 'ko'
    },
    {
        errorcode: 11,
        errormessage: 'Температура должна быть в диапазоне от 41 °F до 113 °F',
        type: 'error',
        page: 'moduleselection',
        language: 'ru'
    },
    {
        errorcode: 11,
        errormessage: 'La temperatura debe estar entre 41-113°F',
        type: 'error',
        page: 'moduleselection',
        language: 'es'
    },


]