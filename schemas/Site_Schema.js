const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    nameCompany: { type: String, default: '' },
    hotlineCompany: { type: String, default: '' },
    cskhCompany: { type: String, default: '' },
    emailCompany: { type: String, default: '' },
    addressCompany: { type: String, default: '' },

    slogan: { type: String, default: '' },
    textGuarantee: { type: String, default: '' },

    btnMoreText: { type: String, default: '' },
    btnMoreLink: { type: String, default: '' },

    btnStoreText: { type: String, default: '' },
    btnStoreLink: { type: String, default: '' },

    iconAddressHeader: { type: String, default: '' },
    titleAddressHeader: { type: String, default: '' },
    linkAddressHeader: { type: String, default: '' },

    iconPurchaseHeader: { type: String, default: '' },
    titlePurchaseHeader: { type: String, default: '' },
    linkPurchaseHeader: { type: String, default: '' },

    iconPhoneHeader: { type: String, default: '' },
    titlePhoneHeader: { type: String, default: '' },
    linkPhoneHeader: { type: String, default: '' },

    iconFreeshipHeader: { type: String, default: '' },
    titleGuaranteeHeader: { type: String, default: '' },
    linkGuaranteeHeader: { type: String, default: '' },

    hostMail: { type: String, default: '' },
    portMail: { type: Number, default: 0 },
    usernameMail: { type: String, default: '' },
    passwordMail: { type: String, default: '' },

    titleSEO: { type: String, default: '' },
    canonicalSEO: { type: String, default: '' },
    descriptionSEO: { type: String, default: '' },
})

module.exports = mongoose.model('site', schema)