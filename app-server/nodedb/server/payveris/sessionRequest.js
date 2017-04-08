(function(){

    var https = require('https');

    var generateId = require('time-uuid/time');

    var utils = require('../../lib/utils/utils');

    var soapMessage = '';
	var accountListXMLData = '';
   
	
    function SessionPayveris(reqBody, callback ,config, tnxId){
        this.body = reqBody;
		this.routingNumber = reqBody.userInfo.routingNumber;
        this.config = config;
        this.utils = utils.util();
        this.callback = callback;
        this.tnxId= tnxId;
        this.soapMessage = soapMessage;
		this.startedAt = new Date();
		this.accountListXMLData = accountListXMLData;
		this.incorrectResponse = {
			"status": {
				"statusCode": "RF",
				"statusDescription": "Request Failed",
				"severity": "Request Failed"
			}
		};
	}

    SessionPayveris.prototype = {

        requestPayveris: function(){

            var accounts = this.body.accounts;
			
			this.prepareAccountList(accounts);

            phNo = (this.body.userInfo.cellPhoneNumberData!=null)?this.body.userInfo.cellPhoneNumberData.phoneNumber:"";
            addressLine = ((this.body.userInfo.defaultAddress.addressLine1!=null)?this.body.userInfo.defaultAddress.addressLine1:"")+
                ((this.body.userInfo.defaultAddress.addressLine2!=null)?this.body.userInfo.defaultAddress.addressLine2:"");
            city  = ((this.body.userInfo.defaultAddress.city!=null)?this.body.userInfo.defaultAddress.city:"");
            state = ((this.body.userInfo.defaultAddress.state!=null)?this.body.userInfo.defaultAddress.state:"");
            country = ((this.body.userInfo.defaultAddress.country!=null)?this.body.userInfo.defaultAddress.country:"");
            zip = ((this.body.userInfo.defaultAddress.zip!=null)?this.body.userInfo.defaultAddress.zip:"");
            organizationName = (this.body.userInfo.organizationName!="")?this.body.userInfo.organizationName:this.body.userInfo.firstName;
            ssnOrTinNumber = (this.body.userInfo.ssnOrTinNumber!=undefined||this.body.userInfo.ssnOrTinNumber==null)?this.body.userInfo.ssnOrTinNumber:"";
			if(ssnOrTinNumber.length>0)
				ssnOrTinNumber = String(ssnOrTinNumber).substring(String(ssnOrTinNumber).length-4);
			
            this.getCreateUserSessionXMLData(this.config.payverisServer.clientCode, this.body.customerId, this.body.customerId,
                this.body.customerType, this.body.userInfo.firstName, this.body.userInfo.lastName,
                this.body.userInfo.emailAddress, this.body.userId, this.body.customerType,
                phNo,addressLine, city, state, zip, country, this.body.businessBillPay,organizationName, ssnOrTinNumber);

            console.log(this.soapMessage);

			var options = {
				hostname:this.config.payverisServer.hostname,
				port:this.config.payverisServer.port,
				path:this.config.payverisServer.CustomerServices,
				method: 'POST',
				headers: {
					'Connection': 'keep-alive' ,
					"Content-Type": "text/xml"
				}
			};

			console.info('Payveris Request At: ' + this.startedAt);
			var that = this;
			var responseData = '';
			var req = https.request(options, (res) => {
				if(res.statusCode == "500"){
					var response = {
						"status": {
							"statusCode": "500",
							"statusDescription": "Request Responded 500",
							"severity": "Request Responded 500"
						}
					};
					that.callback(response , null);
					return true;
				}
				res.on('data', (chunk) => {
					responseData = responseData + chunk;
				});
				res.on('end' , function(){
					console.log('Payveris Request Responded At: ' + (new Date() - that.startedAt) +' ms Payveris return : ' + responseData);
					that.callback(null , responseData);
				});
			});
			;

			req.on('error', (e) => {
				console.error('Payveris Request Failed : ' + e.message);
				that.callback(that.incorrectResponse , null);
			});

			console.info('RequestObj Sent to Payveris');
			req.write(this.soapMessage);
			req.end()


		},
		getAccountXMLData: function(accountNumber, balance, routingNumber, description,
                                     accountType, nickname, accountStatus){
			var xmlData =  '<com:Account AccountCode="'+accountNumber+'" PayBillsFrom="true" ' +
				'PrimaryBillPaymentAccount="true" TransferFrom="true" TransferTo="true">'+
				'<com:RoutingNumber>'+routingNumber+'</com:RoutingNumber>'+
				'<com:AccountNumber>'+accountNumber+'</com:AccountNumber>'+
				'<com:Description>'+description+'</com:Description>'+
				'<com:Type>'+accountType+'</com:Type>'+
				'<com:Balance>'+balance +'</com:Balance>'+
				'<com:NickName>'+nickname+'</com:NickName>'+
				'<com:AccountStatus>'+accountStatus+'</com:AccountStatus>'+
				'<com:AccessRole>Full</com:AccessRole>'+
				'</com:Account>';

			return xmlData;
		},	
		getCreateUserSessionXMLData: function(clientCode, customerCode, userCode, customerType,
                                               firstName, lastName, emailAddress,
                                               userName, userRole, phoneNumber,
                                               addressLine1, city, stateCode, zipCode, country, 
											   isBusinessCustomer, organizationName, ssnOrTinNumber) {
			/*
			'<com:Phone>' +
			'<com:NumberType>Personal</com:NumberType>' +
			'<com:AreaCode></com:AreaCode>' +
			'<com:Prefix></com:Prefix>' +
			'<com:Number></com:Number>' +
			'</com:Phone>' */

			var payverisCustomerType = "Personal";

			if(isBusinessCustomer){
				payverisCustomerType="Business";
			}

			var payverisUserRole = "Personal";

			if(isBusinessCustomer){
				payverisUserRole="Business";
			}


			var xmlData = '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" ' +
				'xmlns:cus="http://www.payveris.com/api/schema/CustomerServices" ' +
				'xmlns:com="http://www.payveris.com/api/schema/CommonTypes">' +
				'<soap:Header/>' +
				'<soap:Body>' +
				'<cus:CreateUserSessionRequest>' +
				'<com:Version>6.5</com:Version>' +
				'<com:APIKey>'+this.config.payverisServer.APIKey+'</com:APIKey>' +
				'<com:ClientCode>'+clientCode+'</com:ClientCode>' +
				'<com:RequestId>' + String(generateId()) + '</com:RequestId>' +
				'<cus:CustomerProfile CustomerCode="' + customerCode + '" UserCode="' + userCode + '">' +
				'<com:CustomerType>' + payverisCustomerType + '</com:CustomerType>' +
				'<com:FirstName>' + (firstName ? firstName : organizationName) + '</com:FirstName>' +
				'<com:LastName>' + (lastName ? lastName : organizationName) + '</com:LastName>' +
				'<com:EmailAddress>' + emailAddress + '</com:EmailAddress>' +
				'<com:Username>' + userName + '</com:Username>' +
				'<com:UserRole>' + payverisUserRole + '</com:UserRole>';

			xmlData = xmlData + '<com:Address>' +
                '<com:AddressLine1>' + addressLine1 + '</com:AddressLine1>' +
                '<com:City>' + city + '</com:City>' +
                '<com:StateCode>' + stateCode + '</com:StateCode>' +
                '<com:ZipCode>' + zipCode + '</com:ZipCode>' +
                '<com:Country>' + country + '</com:Country>' +
                '</com:Address>';

			if(isBusinessCustomer){
				xmlData = xmlData+'<com:Business>';                
			}


			if(isBusinessCustomer){
				xmlData = xmlData+ '<com:BusinessName>'+organizationName+'</com:BusinessName>' +
                    '<com:EmailAddress>'+emailAddress+'</com:EmailAddress>' +
                    '<com:TaxIdentifier>'+ssnOrTinNumber+'</com:TaxIdentifier>';    

/*
            xmlData = xmlData+'<com:Phone>' +
                '<com:NumberType>Personal</com:NumberType>' +
                '<com:AreaCode></com:AreaCode>' +
                '<com:Prefix></com:Prefix>' +
                '<com:Number></com:Number>' +
                '</com:Phone>';
*/                
				xmlData = xmlData + '<com:Address>' +
					'<com:AddressLine1>' + addressLine1 + '</com:AddressLine1>' +
					'<com:City>' + city + '</com:City>' +
					'<com:StateCode>' + stateCode + '</com:StateCode>' +
					'<com:ZipCode>' + zipCode + '</com:ZipCode>' +
					'<com:Country>' + country + '</com:Country>' +
					'</com:Address>';
        
			}

			if(isBusinessCustomer){
				xmlData=xmlData+'</com:Business>';
			}


			xmlData = xmlData + '<com:Accounts>' +
				this.accountListXMLData +
				'</com:Accounts>' +
				'</cus:CustomerProfile>' +
				'<cus:SessionValidForMinutes>15</cus:SessionValidForMinutes>'+
				'</cus:CreateUserSessionRequest>' +
				'</soap:Body>' +
				'</soap:Envelope>';
				
			this.soapMessage = xmlData;
			
		},
		prepareAccountList: function(accounts){
			for(i=0;i<accounts.length;i++){
				var account = accounts[i];
				if(account.accountType=="CHECKING" || account.accountType=="SAVINGS"){
					if(account.statusCode=="OPEN_ACCOUNT" || account.statusCode=="NEW_ACCOUNT" ||
						account.statusCode=="OPEN ACCOUNT" || account.statusCode=="NEW ACCOUNT") {		   
						var accountType = "";
						var nickname = ((account.nickName != null) ? account.nickName : "");
						nickname=nickname.split("&").join("");
						accountType = this.utils.ucFirst(account.accountType.toUpperCase());
						var balance = ((account.availableBalance!=null||
						account.availableBalance!=undefined)?(((account.availableBalance.debitOrCredit == 0)? "-":"")+account.availableBalance.amount):0);
						this.accountListXMLData = this.accountListXMLData + 
												  this.getAccountXMLData(account.accountNo, (parseFloat(balance)*1.00),this.routingNumber, "",accountType,nickname,"Active");
					}
				}
			}
		}
    };

    module.exports = function(reqBody, callback , config, tnxId){
        return (new SessionPayveris(reqBody, callback ,config, tnxId));
    }
})();
