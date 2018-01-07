var n = Math.floor((Math.random() * 100000) + 1);
var userName = 'User' + n;
/*var event = new Event('change');*/

var event = document.createEvent('Event');
event.initEvent('change', true, true);

var $title = document.querySelector('[name=title]');
if ($title) {
    $title.value = 'Mr';
    $title.dispatchEvent(event);
}


var $firstName = document.querySelector('[name=firstname]') || document.querySelector('[name="fullFirstName"]');
if ($firstName) {
    $firstName.value = 'FirstName';
}
var $lastName = document.querySelector('[name=lastname]') || document.querySelector('[name="fullFirstSurname"]');
if ($lastName) {
    $lastName.value = 'LastName';
}
var $secondSurName = document.querySelector('[name="fullSecondSurname"]');
if ($secondSurName) {
    $secondSurName.value = "SecondSurName"
}

var $day = document.querySelector('#day');
if ($day) {
    $day.value = '01';
    $day.dispatchEvent(event);
}
var $month = document.querySelector('#month');
if ($month) {
    $month.value = '01';
    $month.dispatchEvent(event);
}
var $year = document.querySelector('#year');
if ($year) {
    $year.value = '1990';
    $year.dispatchEvent(event);
}
var $gender = document.querySelector('[name=sex]');
if ($gender) {
    $gender.value = 'M';
    $gender.dispatchEvent(event);
}
var $email = document.querySelector('[name=email]');
if ($email) {
    $email.value = 'test@playtech.com';
}
var $verifyEmail = document.querySelector('[name=emailVerify]');
if ($verifyEmail) {
    $verifyEmail.value = 'test@playtech.com';
}

var $countryOfBirth = document.querySelector('[name="countryOfBirth"]');
if ($countryOfBirth) {
    $countryOfBirth.value = 'IT';
    $countryOfBirth.dispatchEvent(event);
}

var $country = document.querySelector('[name="countrycode"]');
if ($country) {
    if (document.querySelectorAll('[name="countrycode"] option')[1]) {
        $country.value = document.querySelectorAll('[name="countrycode"] option')[1].value;
        $country.dispatchEvent(event);
    } else if (document.querySelectorAll('[name="countrycode"] option')[0]){
        $country.value = document.querySelectorAll('[name="countrycode"] option')[0].value;
        $country.dispatchEvent(event);
    }
} else {
    var $countryEs = document.querySelector('#countrycode');
    if ($countryEs) {
        $countryEs.value = "ES";
        $countryEs.dispatchEvent(event);
    }
}
var $zip = document.querySelector('[name=zip]');
if ($zip) {
    $zip.value = 'AA12345';
}

var $province1 = document.querySelectorAll('.fn-province select')[0];
if ($province1) {
    $province1.value = document.querySelectorAll('[name="province"] option')[1].value;
    $province1.dispatchEvent(event);
}
var $cityOfBirth = document.querySelector('[name="cityOfBirth"]');
if ($cityOfBirth) {
    $cityOfBirth.value = document.querySelectorAll('[name="cityOfBirth"] option')[1].value;
    $cityOfBirth.dispatchEvent(event);
    $zip.value = "AA123";
}

var $generateId = document.querySelector('.fn-generate');
if ($generateId) {
    $generateId.click()
}

var $idType = document.querySelector('[name="idType"]');
if ($idType) {
    if (document.querySelectorAll('[name="idType"] option')[1]) {
        $idType.value = document.querySelectorAll('[name="idType"] option')[1].value;
        $idType.dispatchEvent(event);
    }
}

var $idIssuer = document.querySelector('[name="idIssuer"]');
if ($idIssuer) {
    $idIssuer.value = "Test"
}

var $issuePlace = document.querySelector('[name="issuePlace"]');
if ($issuePlace) {
    $issuePlace.value = "Test";
    $issuePlace.dispatchEvent(event);
}

var $idNumber = document.querySelector('[name="idNumber"]');
if ($idNumber) {
    $idNumber.value = "123123123"
}

var $province2 = document.querySelectorAll('.fn-province select')[1];
if ($province2) {
    $province2.value = document.querySelectorAll('[name="province"] option')[1].value;
    $province2.dispatchEvent(event);
}

var $city = document.querySelector('[name="city"]');
if ($city) {
    if (document.querySelectorAll('[name="city"] option')[1]) {
        $city.value = document.querySelectorAll('[name="city"] option')[1].value;
        $city.dispatchEvent(event);
    } else {
        $city.value = "City";
    }
}


var $nationality = document.querySelector('[name="citizenship"]');
if ($nationality) {
    if (document.querySelectorAll('[name="citizenship"] option')[1]) {
        $nationality.value = document.querySelectorAll('[name="citizenship"] option')[1].value;
        $nationality.dispatchEvent(event);
    } else {
        $nationality.value = document.querySelectorAll('[name="citizenship"] option')[0].value;
        $nationality.dispatchEvent(event);
    }
}

var $docType = document.querySelector('#documentType');
if ($docType) {
    $docType.value = document.querySelectorAll('#documentType option')[1].value;
    $docType.dispatchEvent(event);
}

var $docTypeNumber = document.querySelector('#passportId');
if ($docTypeNumber) {
    $docTypeNumber.value = "1234567890";
}
var $state = document.querySelector('[name=state]');
if ($state) {
    $state.value = 'State';
}

var $address = document.querySelector('[name=address]');
if ($address) {
    $address.value = 'Address';
}
var $address2 = document.querySelector('[name=address2]');
if ($address2) {
    $address2.value = 'Address 2';
}
var $address3 = document.querySelector('[name=address3]');
if ($address3) {
    $address3.value = '123';
}

var $phone = document.querySelector('[name=cellphone]');
if ($phone) {
    $phone.value = '+441231231232';
}
var $secondPhone = document.querySelector('[name="second_phone"]');
if ($secondPhone) {
    $secondPhone.value = '+441231231232';
}

var $userName = document.querySelector('[name=userName]');
if ($userName) {
    $userName.value = userName;
}
var $password = document.querySelector('[name=password]');
if ($password) {
    $password.value = 'Password1!';
}
var $passwordVerify = document.querySelector('[name=passwordVerify]');
if ($passwordVerify) {
    $passwordVerify.value = 'Password1!';
}
var $verificationQuestion = document.querySelector('[name=verificationQuestion]');
if ($verificationQuestion) {
    $verificationQuestion.value = 'testQuestion';
}
var $verificationAnswer = document.querySelector('[name=verificationAnswer]');
if ($verificationAnswer) {
    $verificationAnswer.value = 'testAnswer';
}
var $currencyField = document.querySelector('[name="currencyCode"]');
if ($currencyField) {
    if (document.querySelectorAll('[name="currencyCode"] option')) {
        $currencyField.value = document.querySelectorAll('[name="currencyCode"] option')[1].value;
        $currencyField.dispatchEvent(event);
    } else {
        $currencyField.value = document.querySelectorAll('[name="currencyCode"] option')[0].value;
        $currencyField.dispatchEvent(event);
    }
}

var checkboxes = document.querySelectorAll('[type="checkbox"]');
checkboxes.forEach(function(item) {
    if (!item.checked) {
        item.click();
    }
})


/*var $terms = document.querySelector('[name=terms]');
 if ($terms) {
 $terms.click();
 }*/
/*var $regiterBtn = document.querySelector('.btn_type_success.fn-submit');
 if ($regiterBtn) {
 $regiterBtn.click()
 }*/
if ($password) {
    console.log("Username: " + userName + " Password: " + $password.value);
}
