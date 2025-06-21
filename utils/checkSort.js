// check and return the good of entry for sort query
const {
    BadRequestError,
} = require('../error');

const CheckSort = (sort , desc, props) => {
    let stringSort = "";
    let stringDesc = "";

    if (sort) {
        const arrSort = sort.includes(",") ? sort.split(',') : [sort];
        // Check if the sort properties are valid
        arrSort.forEach(prop => {
            if (!props.includes(prop)) {
                throw new BadRequestError(`Invalid sort property: ${prop}`);
            }
        });
        stringSort = sort.replace(',', ' ');
    }
    if (desc) {
        const arrDesc = desc.includes(",") ? desc.split(',') : [desc];
        // Check if the desc properties are valid
        arrDesc.forEach(prop => {
            if (!props.includes(prop)) {
                throw new BadRequestError(`Invalid sort property: ${prop}`);
            }
        });
        const finalArrDesc = arrDesc.map(prop => {
            return '-'.concat(prop);
        })
        stringDesc = finalArrDesc.toString().replace(',', ' ');
    }
    return { stringSort, stringDesc };
}

module.exports = {CheckSort};