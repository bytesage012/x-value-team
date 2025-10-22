const formatPrice = (price) => {
    if (isNaN(price)) {
        return '';
    }
    return `$${price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
};

export default formatPrice;