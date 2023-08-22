class Validation{

    checkPhone(phone){
        const regex=/(84|0[3|5|7|8|9])+([0-9]{8})\b/g
        return regex.test(phone)
    }

    checkEmail(email){
        const regex=/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return regex.test(email)
    }

    checkEmpty(value){
        return value!=undefined && value.trim()!='' ? true : false
    }
    
    checkMaxLength(value, number){
        return value!=undefined && value.length >= number ? true : false
    }

    checkMinLength(value, number){
        return value!=undefined && value.length < number ? true : false
    }

    checkCompare(valueOne, valueTwo){
        return (valueOne!=undefined && valueTwo!=undefined &&valueOne.trim()==valueTwo.trim()) ? true: false 
    }

}

module.exports = new Validation