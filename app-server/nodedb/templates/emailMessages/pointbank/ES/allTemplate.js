(function(){

    var moment = require('moment');

    function EmailTemplate (config , tnxId){
        this.config = config;
        this.tnxId = tnxId;
    }

    EmailTemplate.prototype = {
        generic : function(){
            return '<p>Estimado Cliente,</p><p>Deseandote lo mejor.</p>';
        },
        invalidLoginHeaders: function(){
            return '<br/><table>'+
                '<thead>'+
                '<tr>'+
                '<td style="font-size: 13px;border-left: 1px solid black;border-right: 1px solid black;border-top: 1px solid black;border-bottom: 1px solid black;">fecha</td>'+
                '<td style="font-size: 13px;border-right: 1px solid black;border-top: 1px solid black;border-bottom: 1px solid black;">Hora</td>'+
                '<td style="font-size: 13px;border-right: 1px solid black;border-top: 1px solid black;border-bottom: 1px solid black;">ID de usuario</td>'+
                '<td style="font-size: 13px;border-right: 1px solid black;border-top: 1px solid black;border-bottom: 1px solid black;">dirección IP</td>'+
                '<td style="font-size: 13px;border-right: 1px solid black;border-top: 1px solid black;border-bottom: 1px solid black;">Válido ID de usuario</td>'+
                '</tr>'+
                '</thead>'
        },
        invalidLoginBody: function(data){

            var dataColl = '';
            for(var i = 0; i < data.length ; i++){
                dataColl += '<tr>'+
                    '<td style="font-size: 8px;border-left: 1px solid black;border-right: 1px solid black;border-bottom: 1px solid black;">'+ data[i].dated +'</td>'+
                    '<td style="font-size: 8px;border-right: 1px solid black;border-bottom: 1px solid black;">'+ data[i].time +'</td>'+
                    '<td style="font-size: 8px;border-right: 1px solid black;border-bottom: 1px solid black;">'+ data[i].userId +'</td>'+
                    '<td style="font-size: 8px;border-right: 1px solid black;border-bottom: 1px solid black;">'+ data[i].ipAddress +'</td>'+
                    '<td style="font-size: 8px;border-right: 1px solid black;border-bottom: 1px solid black;">'+ data[i].isValidUserId +'</td>'+
                    '</tr>';
            }

            return '<tbody>'+
                dataColl+
                '</tbody>'+
                '</table>';
        },
        sessionHeaders: function(){
            return '<table>'+
                '<thead>'+
                '<tr>'+
                '<td style="font-size: 13px;border-left: 1px solid black;border-right: 1px solid black;border-top: 1px solid black;border-bottom: 1px solid black;">fecha</td>'+
                '<td style="font-size: 13px;border-right: 1px solid black;border-top: 1px solid black;border-bottom: 1px solid black;">Hora</td>'+
                '<td style="font-size: 13px;border-right: 1px solid black;border-top: 1px solid black;border-bottom: 1px solid black;">ID de usuario</td>'+
                '<td style="font-size: 13px;border-right: 1px solid black;border-top: 1px solid black;border-bottom: 1px solid black;">Sujeto</td>'+
                '<td style="font-size: 13px;border-right: 1px solid black;border-top: 1px solid black;border-bottom: 1px solid black;">cantidad</td>'+
                '</tr>'+
                '</thead>'
        },
        sessionBody: function(data){

            var dataColl = '';
            for(var i = 0; i < data.length ; i++){
                dataColl += '<tr>'+
                    '<td style="font-size: 8px;border-left: 1px solid black;border-right: 1px solid black;border-bottom: 1px solid black;">'+ data[i].dated +'</td>'+
                    '<td style="font-size: 8px;border-right: 1px solid black;border-bottom: 1px solid black;">'+ data[i].time +'</td>'+
                    '<td style="font-size: 8px;border-right: 1px solid black;border-bottom: 1px solid black;">'+ data[i].userId +'</td>'+
                    '<td style="font-size: 8px;border-right: 1px solid black;border-bottom: 1px solid black;">'+ data[i].message +'</td>'+
                    '<td style="font-size: 8px;border-right: 1px solid black;border-bottom: 1px solid black;">'+ data[i].amount +'</td>'+
                    '</tr>';
            }

            return '<tbody>'+
                dataColl+
                '</tbody>'+
                '</table>';
        },
        userActivityHeaders: function(){
            return '<table>'+
                '<thead>'+
                '<tr>'+
                '<td style="font-size: 13px;border-left: 1px solid black;border-right: 1px solid black;border-top: 1px solid black;border-bottom: 1px solid black;">Nombre del cliente</td>'+
                '<td style="font-size: 13px;border-right: 1px solid black;border-top: 1px solid black;border-bottom: 1px solid black;">ID de usuario</td>'+
                '<td style="font-size: 13px;border-right: 1px solid black;border-top: 1px solid black;border-bottom: 1px solid black;">Creado En</td>'+
                '<td style="font-size: 13px;border-right: 1px solid black;border-top: 1px solid black;border-bottom: 1px solid black;">Último acceso</td>'+
                '<td style="font-size: 13px;border-right: 1px solid black;border-top: 1px solid black;border-bottom: 1px solid black;">La contraseña caduca</td>'+
                '<td style="font-size: 13px;border-right: 1px solid black;border-top: 1px solid black;border-bottom: 1px solid black;">Los intentos de login fallidos</td>'+
                '</tr>'+
                '</thead>';
        },
        userActivityBody: function(data){

            var dataColl = '';
            for(var i = 0; i < data.length ; i++){
                dataColl += '<tr>'+
                    '<td style="font-size: 8px;border-left: 1px solid black;border-right: 1px solid black;border-bottom: 1px solid black;">'+ data[i].customerName +'</td>'+
                    '<td style="font-size: 8px;border-right: 1px solid black;border-bottom: 1px solid black;">'+ data[i].userId +'</td>'+
                    '<td style="font-size: 8px;border-right: 1px solid black;border-bottom: 1px solid black;">'+ data[i].createdOn +'</td>'+
                    '<td style="font-size: 8px;border-right: 1px solid black;border-bottom: 1px solid black;">'+ data[i].lastLogin +'</td>'+
                    '<td style="font-size: 8px;border-right: 1px solid black;border-bottom: 1px solid black;">'+ data[i].passwordExp +'</td>'+
                    '<td style="font-size: 8px;border-right: 1px solid black;border-bottom: 1px solid black;">'+ data[i].attempts +'</td>'+
                    '</tr>';
            }

            return '<tbody>'+
                dataColl+
                '</tbody>'+
                '</table>';
        },
        transactionHeaders: function(){
            return '<table border="1">'+
                '<thead>'+
                '<tr>'+
                '<td style="font-family: monospace;font-size: 16px;text-align: center;padding: 2px 5px;">Account Number</td>'+
                '<td style="font-family: monospace;font-size: 16px;text-align: center;padding: 2px 5px;">Posted</td>'+
                '<td style="font-family: monospace;font-size: 16px;text-align: center;padding: 2px 5px;">Description</td>'+
                '<td style="font-family: monospace;font-size: 16px;text-align: center;padding: 2px 5px;">Check</td>'+
                '<td style="font-family: monospace;font-size: 16px;text-align: center;padding: 2px 5px;">Transaction Amount</td>'+
                '<td style="font-family: monospace;font-size: 16px;text-align: center;padding: 2px 5px;">Reference</td>'+
                '<td style="font-family: monospace;font-size: 16px;text-align: center;padding: 2px 5px;">Running Balance</td>'+
                '</tr>'+
                '</thead>'
        },
        transactionBody: function(data){

            var dataColl = '';
            for(var i = 0; i < data.length ; i++){
                dataColl += '<tr>'+
                    '<td style="font-family: monospace;font-size: 13px;padding: 2px 5px;text-align: right;">'+ data[i].accountNo +'</td>'+
                    '<td style="font-family: monospace;font-size: 13px;padding: 2px 5px;">'+ data[i].posted +'</td>'+
                    '<td style="font-family: monospace;font-size: 13px;padding: 2px 5px;">'+ data[i].description +'</td>'+
                    '<td style="font-family: monospace;font-size: 13px;padding: 2px 5px;text-align: right;">'+ data[i].check +'</td>'+
                    '<td style="font-family: monospace;font-size: 13px;padding: 2px 5px;text-align: right;">'+ data[i].transactionAmt +'</td>'+
                    '<td style="font-family: monospace;font-size: 13px;padding: 2px 5px;text-align: right;">'+ data[i].reference +'</td>'+
                    '<td style="font-family: monospace;font-size: 13px;padding: 2px 5px;text-align: right;">'+ data[i].runningBalance +'</td>'+
                    '</tr>';
            }

            return '<tbody>'+
                dataColl+
                '</tbody>'+
                '</table>';
        },
        emailFooter : function(){
            return '<br/><br/><p>Agradeciendote,</p>'+
                '<p>Sinceramente Suyo,</p>'+
                '<p style="font-weight: bold">'+ this.config.bankName +'</p>'+
                '<div>'+
                '<p><img style ="float: left" src="cid:imageEmailTemplateEnd"/>importantes : '+ this.config.bankName +' nunca va a enviar correos electrónicos que solicitan información confidencial. Si usted recibe un e-mail / llamada solicitando sus datos de Banca por Internet como su PIN, contraseña, número de cuenta, por favor no responder. Este es un correo electrónico generado automáticamente. Por favor, no responder de nuevo a este mensaje.</p>'+
                '</div>'+
                '<br/>'+
                '<p><b>RENUNCIA</b>:</p>'+
                '<p>El contenido de este mensaje y cualquier archivo adjunto son confidenciales y están destinados únicamente a la atención y el uso de un solo destinatario. La información contenida en este mensaje puede estar sujeta al secreto profesional, profesional o de otro o de otra manera puede ser protegida por otras normas legales. Este mensaje no debe ser copiada o transmitirla a cualquier otra persona sin el permiso expreso del remitente. Si usted no es el destinatario no está autorizado a revelar, copiar, distribuir o retener este mensaje o cualquier parte de ella. Si ha recibido este mensaje por error, por favor notifique al remitente y destruir el mensaje original. Nos reservamos el derecho de supervisar todos los mensajes de correo electrónico que pasan a través de nuestra red. Para saber más sobre nuestros productos, visite nuestro sitio web <a href="'+ this.config.bankSiteUrl +'">'+ this.config.bankSiteName +'</a> .<p>'
        },
        updateInfo: function(data){

            var newDated = new Date();
            var updateTemplate = '<p>Actualizar información personal detalles de la solicitud se dan a continuación.</p>'+
                '<p>Fecha de solicitud y hora – '+ moment(newDated).format("dddd, MMMM D, YYYY h:mm:ss A") +'</p>'+
                '<p>Actualización de la información personal Detalles</p>';

            if(data.AddressLine1 != '') updateTemplate = updateTemplate +'<p>Dirección Línea 1 – '+ data.AddressLine1 +'</p>';
            if(data.AddressLine2 != '') updateTemplate = updateTemplate +'<p>Dirección Línea 2– '+ data.AddressLine2 +'</p>';
            if(data.city != '') updateTemplate = updateTemplate +'<p>ciudad – '+ data.city +'</p>';
            if(data.state != '') updateTemplate = updateTemplate +'<p>estado – '+ data.state +'</p>';
            if(data.zip != '') updateTemplate = updateTemplate +'<p>Código Postal– '+ data.zip +'</p>';
            if(data.country != '') updateTemplate = updateTemplate +'<p>país – '+ data.country +'</p>';
            if(data.homePhone != '') updateTemplate = updateTemplate +'<p>Teléfono De Casa – '+ data.homePhone +'</p>';
            if(data.workPhone != '') updateTemplate = updateTemplate +'<p>Teléfono de trabajo – '+ data.workPhone +'</p>';
            if(data.cellPhone != '') updateTemplate = updateTemplate +'<p>celular – '+ data.cellPhone +'</p>';
            if(data.emailId != '') updateTemplate = updateTemplate +'<p>Identificación de correo – '+ data.emailId +'</p>';

            return updateTemplate;
        },
        wireTransfer: function(data){

            var wireTemplate = '<p>Transferencia de alambre detalles de la solicitud se dan a continuación.</p>'+
                '<p>Fecha de solicitud y hora – '+ moment(data.updatedOn).format("dddd, MMMM D, YYYY h:mm:ss A") +'</p>'+
                '<p>Información del remitente</p>'+
                '<p>cuenta – '+ data.fromAccount+'</p>'+
                '<p>cantidad - $ '+ data.amount +'</p>'+
                '<p>Información De Beneficiario</p>'+
                '<p>Nombre del Beneficiario – '+ data.beneficiary.beneficiaryName +'</p>'+
                '<p>cuenta Beneficiaria – '+ data.beneficiary.recipientBankInfo.accountNo +'</p>';

            if(data.beneficiary.specialInstruction.instruction1) wireTemplate = wireTemplate + '<p>instrucciones1 Especial – '+ data.beneficiary.specialInstruction.instruction1 +'</p>';
            if(data.beneficiary.specialInstruction.instruction2) wireTemplate = wireTemplate + '<p>instrucciones1 Especia2 – '+ data.beneficiary.specialInstruction.instruction2 +'</p>';
            if(data.beneficiary.specialInstruction.instruction3) wireTemplate = wireTemplate + '<p>instrucciones1 Especia3 – '+ data.beneficiary.specialInstruction.instruction3 +'</p>';
            if(data.beneficiary.specialInstruction.instruction4) wireTemplate = wireTemplate + '<p>instrucciones1 Especia4 – '+ data.beneficiary.specialInstruction.instruction4 +'</p>';
            wireTemplate = wireTemplate + '<p>Beneficiario Bank Information</p>'+
                '<p>Nombre del beneficiario del Banco – '+ data.beneficiary.recipientBankInfo.bankName +'</p>'+
                '<p>Banco Beneficiario Número de ruta – '+ data.beneficiary.recipientBankInfo.bankRoutingNo +'</p>';

            if(data.beneficiary.intermediateBank.bankName || data.beneficiary.intermediateBank.bankRoutingNo) wireTemplate = wireTemplate + '<p>De intermediario de Información Bancaria</p>';
            if(data.beneficiary.intermediateBank.bankName) wireTemplate = wireTemplate + '<p>De intermediario Nombre del banco – '+ data.beneficiary.intermediateBank.bankName +'</p>';
            if(data.beneficiary.intermediateBank.bankRoutingNo) wireTemplate = wireTemplate + '<p>De intermediario Número de ruta del banco – '+ data.beneficiary.intermediateBank.bankRoutingNo +'</p>';

            wireTemplate = wireTemplate + '<p>Horario de Información</p>'+
                '<p>Horario Fecha – '+ data.scheduledInfo.scheduledDate +'</p>'+
                '<p>Tipo de programación – ' + data.scheduledInfo.scheduledType +'</p>';

            if(data.scheduledInfo.scheduledType == "Recurring") wireTemplate = wireTemplate + '<p>frecuencia – '+ data.scheduledInfo.frequency +'</p>'+
                '<p>Fecha de caducidad – '+ data.scheduledInfo.expiryDate +'</p>';

            return wireTemplate;
        },
        orderCheckBook: function(data){

            var newDated = new Date();
            var orderCheckTemplate = '<p>Compruebe la detalles de la solicitud de pedido se dan a continuación.</p>'+
                '<p>Fecha de solicitud y hora – '+ moment(data.updatedOn).format("dddd, MMMM D, YYYY h:mm:ss A") +'</p>'+
                '<p>Compruebe la detalles Solicitar</p>'+
                '<p>cuenta – '+ data.accountNo +'</p>'+
                '<p>Comenzando número de cheque – '+ data.startingCheckNo +'</p>'+
                '<p>Número de teléfono – '+ data.phoneNumber +'</p>'+
                '<p>Número de Cajas – '+ data.noOfBoxes +'</p>'+
                '<p>diseño – '+ data.design +'</p>'+
                '<p>estilo – '+ data.style +'</p>';

            if(data.comments) orderCheckTemplate = orderCheckTemplate + '<p>Comentarios – '+ data.comments +'</p>';

            return orderCheckTemplate;
        },
        resetPassword: function(data){
            return '<p>Dear '+ data.customerName +',</p><p>As per your request we have reset your password. Your new password is <b>'+ data.password+'</b></p><br/>' +
                   '<p>For security reasons we recommend you not to share your password with anyone including bank staff. You are requested to change this password on login.</p><br/>';
        },
        resetSecurityQuestions: function(data){
            return '<p>Dear '+ data.customerName +',</p><p>A su solicitud, hemos restablecido las preguntas de seguridad. Se le pedirá para establecer nuevas preguntas de seguridad después de su próximo inicio de sesión.</p><br/>';
        },
        forgottenUserId: function(data){
            return '<p>Dear '+ data.customerName +',</p><p>A su solicitud, hemos recuperado su usuario. El ID de usuario es <b>'+ data.userId +'</b></p><br/>';
        },
        reminderMail: function(data){
            return '<p>Estimado '+ data.customerName +',</p><p>Ha establecido un recordatorio. </p><p>'+ data.reminderMessage +'</p>'
        },
        otpAuthFactor: function(data){
            return '<p>Estimado cliente,</p><p>La contraseña de un solo uso (OTP) para su operación está ' + data.otp + '</p><p>El banco nunca llama para verificar su OTP. No divulgar esta OTP a cualquiera.</p>';
        },
        bankMailFooter: function(){
            return '';//<br/><br/><p><b>importante/CONFIDENTIAL</b>: Esta transmisión está destinado solamente para el uso del destinatario (s) que se muestra. Contiene información que puede ser privilegiada, confidencial y / o exenta de divulgación bajo la ley aplicable. Si usted no es el destinatario de esta transmisión, se le notifica que la copia, uso o distribución de cualquier información o material de transmisión adjunta está estrictamente prohibido. Si ha recibido esta transmisión por error, por favor póngase en contacto con el remitente inmediatamente.</p>';
        },
        bankAdminPassword: function(data){
            return '<p>Estimado banquero, </p><p>El administrador de tu Identidad de conexión:</p><p>Identidad de usuario: <b>' + data.userName +'</b></p><p>Contraseña:  <b>'+ data.password +'</b></p>'+
                   '<p>Se le requiere que cambie su contraseña después de iniciar sesión por primera vez.</p><br/>';
        },
        bankAdminPasswordChanged : function(data){
            return '<p> Estimado banquero, </p> <p> Tu contraseña ha sido cambiada exitosamente.  </p><br/>';
        },
        bankAdminLocked : function(data){
            return '<p> Estimado banquero, </p> <p> Su perfil ha sido bloqueado debido a múltiples intentos de acceso fallidos. Por favor, póngase en contacto con un administrador para desbloquear su perfil.  </p> <br/> <p> Gracias y, </p> <p> Banco </p>';
        },
        bankAdminLockedBySupervisor : function(data){
            return '<p> Estimado banquero, </p> <p> Su perfil ha sido bloqueada por un administrador. Si esto se hizo por error, por favor, póngase en contacto con un administrador.  </p> <br/> <p> Gracias y Saludos, </p> <p> El Banco </ p >';
        },
        bankAdminUnlocked : function(data){
            return '<p> Estimado banquero, </p> <p> Su perfil ha sido desbloqueado por un administrador. Ahora puede iniciar sesión con su ID de usuario y la contraseña. </p> <br/> <p> Gracias y Saludos, </p> <p> El Banco </ p >';
        },
        bankAdminDeleted : function(data){
            return '<p> Estimado banquero, </p> <p> Su perfil ha sido desactivada por un administrador. Si esto se hizo por error, por favor, póngase en contacto con un administrador.  </p> <br/> <p> Gracias y Saludos, </p> <p> El Banco </ p >';
        },
        bankAdminProfileChanged : function(data){
            return '<p> Estimado banquero, </p> <p> Su perfil se ha cambiado correctamente. </p> <br/>';
        },
        userLoginPassword: function(data){
            return '<p> Estimado ' + data.customerName + ' , </p> ' + ' <p> Gracias por inscribirse en el sistema de banca por Internet en línea de PointBank ! </p><br/><p> Se adjunta la contraseña temporal. Por favor utilice este para iniciar sesión en su cuenta en www.pointbank.com . A continuación se le pedirá que cambie su identificador de usuario y una contraseña . Si no puede acceder al sistema en el futuro, que sería capaz de restablecer su contraseña a la temporal hace referencia a continuación . De lo contrario , por razones de seguridad y privacidad, sólo será capaz de comunicar su contraseña temporal por correo, o en persona a la presentación de una identificación apropiada. </p><br/><p> Si usted tiene alguna pregunta , por favor llame al 940-686-7000 </p> <br/> <p> Una vez más, gracias por permitir PointBank la oportunidad de servirle </p> <br/> <p style="text-align: center;"> P/W: <b> ' + data.password + ' </b> </p>';
        },
        userLoginUserId: function(data){
            return '<p> Estimado ' + data.customerName + ' , </p> ' + ' <p> Gracias por inscribirse en el sistema de banca por Internet en línea de PointBank ! </p><br/><p> Cerrado es tu ID de usuario temporal. Por favor utilice este para iniciar sesión en su cuenta en www.pointbank.com . A continuación se le pedirá que cambie su identificador de usuario y una contraseña . Si no puede acceder al sistema en el futuro, que sería capaz de restablecer su contraseña a la temporal hace referencia a continuación . De lo contrario , por razones de seguridad y privacidad, sólo será capaz de comunicar su contraseña temporal por correo, o en persona a la presentación de una identificación apropiada. </p><br/><p> Si usted tiene alguna pregunta , por favor llame al 940-686-7000 </p> <br/> <p> Una vez más, gracias por permitir PointBank la oportunidad de servirle </p> <br/> <p style="text-align: center;"> Identidad de usuario: <b> ' + data.userName + ' </b> </p><p style="text-align: center;"> Su contraseña será enviada por separado . </p>';
        },
        alertLoginReset: function(data){
            return '<p>ALERTA: Su nombre de usuario que estaba cerrada debido a los intentos de inicio de sesión no válidos se ha restablecido. Por favor, intente iniciar sesión con su ID de usuario y contraseña.</p>'+
                '<br/><p>Para cualquier problema por favor póngase en contacto con su banco.</p>'
                /*'<br/><p>IMPORTANT/CONFIDENTIAL: This transmission is intended only for the use of the addressee(s) shown. It contains information that may be privileged, confidential and/or exempt from disclosure under applicable law. If you are not the intended recipient of this transmission, you are hereby notified that the copying, use, or distribution of any information or materials transmitted herewith is strictly prohibited. If you have received this transmission by mistake, please contact sender immediately.</p>'*/;
        },
        alertLoginLimitExceeded: function(data){
            return '<p>ALERTA: Sus intentos de conexión han superado el límite diario y debe ser reiniciado. Póngase en contacto con su banco.</p>'+
                '<br/><p>Para cualquier problema por favor póngase en contacto con su banco.</p>';
        },
        alertACHProcessed: function(data){
            return '<p>ALERTA: ACH hornada ' + data.batchName + ' se ha procesado con éxito para la fecha de vigencia '+ data.effectiveDate +'.</p>';
        },
        alertACHNotProcessed: function(data){
            return '<p>ALERTA: ACH hornada ' + data.batchName + ' con fecha de vigencia '+ data.effectiveDate +' se ha disminuido.</p>';
        },
        alertACHImportProcessed: function(data){
            return '<p>archivo ACH '+ data.fileName +' con fecha de vigencia '+ data.dated +' se ha procesado con éxito.</p>';
        },
        alertACHImportNotProcessed: function(data){
            return '<p>El archivo de ACH, '+ data.fileName +' con fecha de vigencia '+ data.dated +' no fue capaz de ser procesado. Por favor, póngase en contacto con nosotros en 940-686-7000 o 972-434-3200 con preguntas.</p>';
        },
        alertWireTransfer: function(data){
            return '<p>Solicitud de transferencia bancaria para el destinatario: ALERTA '+ data.recipientName +' para la cantidad de $'+ data.amount +' prevista para ' + data.dated + ' se ha procesado con éxito.</p>';
        },
        changedFTL: function(data){
            return '<p>Estimado '+ data.customerName+', </p>'+'<p>Su cuenta de banca por Internet se ha activado con nombre de usuario <b>'+ data.userName +'</b> .Recibirá su contraseña temporal en un correo electrónico por separado.</p><br/>';
        },
        changedPassword: function(data){
            return '<p>Estimado '+ data.customerName+', </p>'+'<p>Su contraseña se ha cambiado recientemente. Por razones de seguridad, le recomendamos que no comparta su contraseña con nadie incluyendo el personal del banco. </p><br/>';
        },
        customerOnboardingUserMail: function(data){
            return '<p> Estimado ' + data.customerName + ' , </p> ' + ' <p> Gracias por inscribirse en el sistema de banca por Internet en línea de PointBank ! </p><br/><p> Cerrado es tu ID de usuario temporal. Por favor utilice este para iniciar sesión en su cuenta en www.pointbank.com . A continuación se le pedirá que cambie su identificador de usuario y una contraseña . Si no puede acceder al sistema en el futuro, que sería capaz de restablecer su contraseña a la temporal hace referencia a continuación . De lo contrario , por razones de seguridad y privacidad, sólo será capaz de comunicar su contraseña temporal por correo, o en persona a la presentación de una identificación apropiada. </p><br/><p> Si usted tiene alguna pregunta , por favor llame al 940-686-7000 </p> <br/> <p> Una vez más, gracias por permitir PointBank la oportunidad de servirle </p> <br/> <p style="text-align: center;"> Identidad de usuario: <b> ' + data.userName + ' </b> </p><p style="text-align: center;"> Su contraseña será enviada por separado . </p>';
        },
        customerOnboardingPasswordMail: function(data){
            return '<p> Estimado ' + data.customerName + ' , </p> ' + ' <p> Gracias por inscribirse en el sistema de banca por Internet en línea de PointBank ! </p><br/><p> Se adjunta la contraseña temporal. Por favor utilice este para iniciar sesión en su cuenta en www.pointbank.com . A continuación se le pedirá que cambie su identificador de usuario y una contraseña . Si no puede acceder al sistema en el futuro, que sería capaz de restablecer su contraseña a la temporal hace referencia a continuación . De lo contrario , por razones de seguridad y privacidad, sólo será capaz de comunicar su contraseña temporal por correo, o en persona a la presentación de una identificación apropiada. </p><br/><p> Si usted tiene alguna pregunta , por favor llame al 940-686-7000 </p> <br/> <p> Una vez más, gracias por permitir PointBank la oportunidad de servirle </p> <br/> <p style="text-align: center;"> P/W: <b> ' + data.password + ' </b> </p>';
        }
    };

    module.exports = function(config , tnxId){
        return (new EmailTemplate(config , tnxId));
    };
})();