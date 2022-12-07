let info_form = document.forms.info_form;
const output = document.getElementById('output');
const remove = document.getElementById('remove');

Array.from(info_form).forEach(element => {
    if ((element.name === 'city' && element.type === 'checkbox') || (element.name === 'cheese')) {
        element.addEventListener('change', render);
    } else {
        element.addEventListener('blur', render);
    }
});

remove.addEventListener('click', ()=> {
    output.innerHTML = '';
    info_form.reset();
})

function render() {
    if(validName(info_form[0].value)){
        if(validName(info_form[1].value)){
            if(validDate(info_form[2].value)){
                const age = getAge(info_form[2].value);
                const select = info_form[3];
                const cheese = select.options[select.selectedIndex].text;
                const city_str = getCityStr();
                output.innerHTML = 'Hello ' + info_form[0].value + ' ' + info_form[1].value + ', you are ' + age + ' years old, your favourite cheese is ' + cheese + ' and you\'ve lived in ' + city_str;
            }else{
                output.innerHTML = 'Do not enter an invalid date of birth';
            }
        }else{
            output.innerHTML = 'Do not enter an invalid lastname';
        }
    }else{
        output.innerHTML = 'Do not enter an invalid firstname';
    }
}

function validName(name) {
    if(name.length >= 3 && name.length <= 50){
        return true;
    }
}

function dateOrder(date_str) {
    const m = date_str[3] + date_str[4];
    const d = date_str[0] + date_str[1];
    const new_date_str = m+'/'+d+'/'+date_str.substr(6,9);
    return new_date_str;
}

function validDate(date_str) {
    const regex = /[0-9]{2}\/[0-9]{2}\/[0-9]{4}/;
    let match = date_str.match(regex);
    const new_str = dateOrder(date_str);
    const date = new Date(new_str);
    if(match && date_str === match[0] && !isNaN(date)) {
        return true;
    }
    return false;
}

function getAge(date_str) {
    const now = new Date();
    const new_str = dateOrder(date_str);
    const pre = new Date(new_str);
    let dif = now.getTime() - pre.getTime();
    return Math.floor(dif / (1000 * 3600 * 24 * 365));
}

function getCityStr() {
    let cities = [];
    const drop = document.getElementsByName('city');
    let count = 0;
    for(let i = 0; i < drop.length; ++i){
        if(drop[i].checked){
            cities[count] = drop[i].value;
            count++;
        }
    }
    if(cities.length == 0) {
        return 'no cities.';
    }
    let city_str = '';
    for(let i = 0; i < cities.length; ++i){
        if(i != cities.length-1){
            city_str += cities[i]+', ';
        }else{
            city_str += cities[i]+'.';
        }
    }
    return city_str;
}