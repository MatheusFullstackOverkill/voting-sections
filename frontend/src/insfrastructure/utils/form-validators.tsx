import moment from 'moment';

export const validateSimpleEmail = (value: string | undefined | null) => {
    const re = /^(.+)@(.+)$/;
    if(!value || value === '') {
        return 'Campo não pode ser nulo';
    }
    if(!re.test(value)) {
        return 'Email inválido';
    }
    return '';
};

export const validateEmail = (value: string | undefined | null) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!value || value === '') {
        return 'Campo não pode ser nulo';
    }
    if(!re.test(value)) {
        return 'Email inválido';
    }
    return '';
};

export const validateRegex = (value: string | undefined | null, regex: RegExp, error: string) => {
    if(!value || !regex.test(value)) {
        return error ? error : 'Texto inválido';
    }
    return '';
};

export const validateFile = (value: string | undefined | null) => {
    if(!value || value === '') {
        return 'Arquivo inválido';
    };
    return '';
}

export const validateCEP = (value: string | undefined | null) => {
    if(!value || value === '') {
        return 'Campo não pode ser nulo';
    }
    let onlynumbers_value = value.replace(/[^0-9]+/g, '');
    const re = /^[0-9]{8}$/g;
    if(!re.test(onlynumbers_value)) {
        return 'CEP inválido';
    };
    return '';
}

export const searchCEP = async (value: string) => {
    let onlynumbers_value = value.replace(/[^0-9]+/g, '');
    if(onlynumbers_value.length >= 8) {
       const response = await fetch(`https:/viacep.com.br/ws/${onlynumbers_value}/json/`);
       const json = await response.json();
       return json;
    }
    return {};
}

export const validateDocument = (value: string | undefined | null) => {
    let type;
    if(validateCPF(value)) {
        type = 'CPF';
        return type;
    };
    if(validateCNPJ(value)) {
        type = 'CNPJ';
        return type;
    };
    return false;
}

export const CPFValidator = (value: string | undefined | null) => {
    if(!validateCPF(value)) {
        return 'CPF inválido';
    };
    return '';
}

export const CNPJValidator = (value: string | undefined | null) => {
    if(!validateCNPJ(value)) {
        return 'CNPJ inválido';
    };
    return '';
}

export const validateCPF = (cpf: any) => {
    if (typeof cpf !== "string") return false
    cpf = cpf.replace(/[\s.-]*/igm, '')
    if (
        !cpf ||
        cpf.length !== 11 ||
        cpf === "00000000000" ||
        cpf === "11111111111" ||
        cpf === "22222222222" ||
        cpf === "33333333333" ||
        cpf === "44444444444" ||
        cpf === "55555555555" ||
        cpf === "66666666666" ||
        cpf === "77777777777" ||
        cpf === "88888888888" ||
        cpf === "99999999999" 
    ) {
        return false
    }
    var soma = 0
    var resto
    for (var i = 1; i <= 9; i++) 
        soma = soma + parseInt(cpf.substring(i-1, i)) * (11 - i)
    resto = (soma * 10) % 11
    if ((resto === 10) || (resto === 11))  resto = 0
    if (resto !== parseInt(cpf.substring(9, 10)) ) return false
    soma = 0
    for (var i = 1; i <= 10; i++) 
        soma = soma + parseInt(cpf.substring(i-1, i)) * (12 - i)
    resto = (soma * 10) % 11
    if ((resto === 10) || (resto === 11))  resto = 0
    if (resto !== parseInt(cpf.substring(10, 11) ) ) return false
    return true
}

export const validateCNPJ = (value: any) => {
    if (!value) return false
  
    // / Aceita receber o valor como string, número ou array com todos os dígitos
    const validTypes =
      typeof value === 'string' || Number.isInteger(value) || Array.isArray(value)
  
    // / Elimina valor em formato inválido
    if (!validTypes) return false
  
    // / Guarda um array com todos os dígitos do valor
    const match = value.toString().match(/\d/g)
    const numbers = Array.isArray(match) ? match.map(Number) : []
  
    // / Valida a quantidade de dígitos
    if (numbers.length !== 14) return false
    
    // / Elimina inválidos com todos os dígitos iguais
    const items = [...new Set(numbers)]
    if (items.length === 1) return false
  
    // / Cálculo validador
    const calc = (x: any) => {
      const slice = numbers.slice(0, x)
      let factor = x - 7
      let sum = 0
  
      for (let i = x; i >= 1; i--) {
        const n = slice[x - i]
        sum += n * factor--
        if (factor < 2) factor = 9
      }
  
      const result = 11 - (sum % 11)
  
      return result > 9 ? 0 : result
    }
  
    // / Separa os 2 últimos dígitos de verificadores
    const digits = numbers.slice(12)
    
    // / Valida 1o. dígito verificador
    const digit0 = calc(12)
    if (digit0 !== digits[0]) return false
  
    // / Valida 2o. dígito verificador
    const digit1 = calc(13)
    return digit1 === digits[1]
};

export const validatePhone = (value: string | undefined | null) => {
    if(!value || value === '') {
        return 'Campo não pode ser nulo';
    }
    if(value.length < 10 || !/^[0-9]+$/.test(value)) {
        return 'Telefone inválido, apenas números e pelos menos 10 dígitos';
    }
    return '';
};

export const validateDate = (value: any) => {
    if(!moment(value).isValid()) {
        return 'Data inválida';
    };
    return '';
}

export const emptyField = (value: string | undefined | null, type: string) => {    
    if(value === '' || value === null || value === undefined || (value === '0' && type === 'number') || (value && type === 'money' && parseInt(value.replaceAll('R$', '')) === 0)) {
        return 'Campo não pode ser nulo';
    };
    return '';
};

export const notCheckedField = (value: boolean) => {
    if(!value) {
        return 'Campo deve ser selecionado';
    };
    return '';
}

export const emptyArray = (array: Array<any>) => {
    if(!array || array.length === 0) {
        return 'Lista não pode estar vázia';
    }
    return '';
}

export const validateString = (value: string | undefined | null) => {
    const re = /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/;
    if(!value || value === '') {
        return 'Campo não pode ser nulo';
    }
    if(!re.test(value)) {
        return 'Apenas letras, acentos e espaços.';
    }
    return '';
};

export const validateValueInArray = (value: string | undefined | null, array: Array<any>) => {
    if(!value || value === '') {
        return 'Campo não pode ser nulo';
    }
    if(!array.includes(value)) {
        return 'Escolha um item da lista.';
    }
    return '';
}

export const validateLength = (value: string | undefined | null, minLenght: number) => {
    if(!value || value.length < minLenght) {
        return `Minimo de ${minLenght} caractéres.`;
    }
    return '';
};

export const validatePassword = (value: string | undefined | null) => {
    if(!value || value.length < 8) {
        return 'Senha deve conter no mínimo 8 caracteres';
    }
    return '';
};

export const validatePasswordConfirmation = (password: string, value: string | undefined | null) => {
    if(value !== password) {
        return 'Senha incorreta';
    }
    return '';
};

export const formatErrors = (errors: any) => {
    Object.keys(errors).map(key => {
        if(typeof errors[key] === 'object' && errors[key].length > 0) {
            errors[key] = errors[key].filter((x: any) => x !== '');
        }
    });
    return errors;
}


export const formatListErrors = (list_data: Array<any>) => {
    let list_errors = list_data.map(x => formatErrors(x));
    return list_errors.filter(x => Object.values(x).filter(x => x !== '').length > 0).length > 0 ? 
    list_errors : '';
}

export const filteredErrors = (errors: any) => {
    return Object.keys(errors).filter(x => errors[x] !== '');
}

export const errorsLength = (errors: any) => {
    return Object.keys(errors).filter(x => errors[x].filter((x: any) => x !== '').length > 0 ).length;
    // return Object.keys(errors).filter(x => errors[x] !== '' || (Array.isArray(errors[x]) && errors[x].filter((y: any) => y.filter((z: any) => errors[z] !== '')) )).length;
}

export function ErrorMessage({errors}:{errors: string[]}) {
    return errors && errors.length > 0 ?
    <div className='errors'
        style={{
            padding: '5px',
            background: 'white',
            border: '1px solid #EB575',
            borderRadius: '15px',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px'
        }}>{
            errors.map(error => 
                <div className='error'>
                    <p style={{ color: '#EB5757', fontWeight: 'bold' }}>{error}</p>
                </div>)
        }
    </div> : <></>
}