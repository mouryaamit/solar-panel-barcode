(function(){

    module.exports = function(config){
        return {
            NoRecordFound: {
                status: 400,
                responseData: {
                    message: 'ningún record fue encontrado'
                }
            },
            ZZ:{
                status: 400,
                responseData: {
                    message: "Respuesta Core Falló"
                }},
            1001:{
                status: 400,
                responseData: {
                    message: "Cuenta no disponible"
                }
            },
            1002: {
                status: 400,
                responseData: {
                    message: "CUENTA_PROPIETARIO_INFORMACION_NO_DISPONIBLE"
                }
            },
            1003:{
                status: 400,
                responseData: {
                    message: "NO_VÁLIDO_ESTADO_CUENTA"
                }
            },
            1004:{
                status: 400,
                responseData: {
                    message: "SALDO_INSUFICIENTE"
                }
            },
            2001:{
                status: 400,
                responseData: {
                    message: "INFO_DEL_CLIENTE_NO_DISPONIBLE"
                }
            },
            3001:{
                status: 400,
                responseData: {
                    message: "TRANSACCIÓN_INFO_NO_DISPONIBLE"
                }
            },
            3002:{
                status: 400,
                responseData: {
                    message: "Código de transacción Información no disponible"
                }
            },
            4001:{
                status: 400,
                responseData: {
                    message: "INSTITUCIÓN_NO_DISPONIBLE"
                }
            },
            9001:{
                status: 400,
                responseData: {
                    message: "MEDIDAS_QUE_SE_PIDE_NO_ES_POSIBLE"
                }
            },
            9999:{
                status: 400,
                responseData: {
                    message: "ERROR_GENERAL"
                }
            },
            9000:{
                status: 400,
                responseData: {
                    message: "ERROR_DE_VALIDACION"
                }
            },
            9002:{
                status: 400,
                responseData: {
                    message: "CAMPO_REQUERIDA_NO_INCLUIDO"
                }
            },
            500:{
                status: 400,
                responseData: {
                    message: "Respuesta Core Falló"
                }
            },
            RF:{
                status: 400,
                responseData: {
                    message: "Core No disponible"
                }
            },
            00:{
                status: 400,
                responseData: {
                    message: "ÉXITO"
                }
            },
            AuthorisationFailed: {
                status: 400,
                responseData: {
                    message: 'Usted no está facultada para acceder a este servicio. Por favor, póngase en contacto con el Banco de administración'
                }
            },
            UserCreationFailed: {
                status: 400,
                responseData: {
                    message: 'Id Usuario ya registrados'
                }
            },
            UserNotFoundFailed: {
                status: 400,
                responseData: {
                    message: 'nombre de usuario no válido'
                }
            },
            UserIDNotFoundFailed: {
                status: 400,
                responseData: {
                    message: 'Los destinatarios no válidos ID de usuario'
                }
            },
            OTPNotFoundFailed: {
                status: 400,
                responseData: {
                    message: 'Invalid Request Details'
                }
            },
            OTPTimeOut: {
                status: 400,
                responseData: {
                    message: 'OTP Timed-Out'
                }
            },
            UserNotEnrolledFailed: {
                status: 400,
                responseData: {
                    message: 'Olvidé mi contraseña no es aplicable para los clientes que no están inscritos'
                }
            },
            SecurityQuestionsPasswordReset: {
                status: 400,
                responseData: {
                    message: 'Sus preguntas de seguridad han sido restablecer por banco admin . Por favor, póngase en contacto con el apoyo del Banco para el restablecimiento de la contraseña.'
                }
            },
            UserIdComplianceFailed: {
                status: 400,
                responseData: {
                    message: 'Please enter a valid Username'
                }
            },
            PasswordComplianceFailed: {
                status: 400,
                responseData: {
                    message: 'Please enter a valid Password'
                }
            },
            NewInfoFailed: {
                status: 400,
                responseData: {
                    message: 'Introduzca nuevo ID de usuario / contraseña'
                }
            },
            UserExistsFailed: {
                status: 400,
                responseData: {
                    message: 'UserId ya existe. Por favor compruebe la disponibilidad del usuario Id'
                }
            },
            InCorrectPasswordFailed: {
                status: 400,
                responseData: {
                    message: 'La antigua contraseña que ha introducido es incorrecta'
                }
            },
            SamePasswordFailed: {
                status: 400,
                responseData: {
                    message: 'La contraseña introducida ya se ha utilizado. Por favor, introduzca una nueva contraseña'
                }
            },
            UserSQValidationFailed: {
                status: 400,
                responseData: {
                    message: 'respuesta Incorrecta'
                }
            },
            InCorrectRetryError: {
                status: 400,
                responseData: {
                    message: 'Cuenta Bloqueada. Debido a múltiples intentos de identificación no son correctos, su cuenta está bloqueada. Por favor, póngase en contacto con la línea de ayuda'
                },
                nextStep: config.nextStepTo.goToLogin
            },
            AccessTypeFoundFailed: {
                status: 400,
                responseData: {
                    message: 'Tipo de acceso incorrecta'
                }
            },
            AccessTypeExistsFailed: {
                status: 400,
                responseData: {
                    message: 'Tipo de acceso ya existe'
                }
            },
            UserLoginFailed: {
                status: 400,
                responseData: {
                    message: 'Nombre de usuario incorrecta / contraseña'
                }
            },
            UserLoginFailedLocked: {
                status: 400,
                responseData: {
                    message: 'Admin is Locked. Please Contact Your Supervisor'
                }
            },
            UserLoginFailedDeleted: {
                status: 400,
                responseData: {
                    message: 'Admin Credentials Have Been Revoked. Please Contact Your Supervisor'
                }
            },
            MultipleLoginError: {
                status: 400,
                responseData: {
                    message: 'Ya se ha autentificado. Entrada múltiple no está permitida'
                },
                nextStep: config.nextStepTo.goToLogin
            },
            InCorrectRequestError: {
                status: 400,
                responseData: {
                    message: 'Se proporcionó Solicitud incorrecta'
                }
            },
            SessionCreationFailed: {
                status: 400,
                responseData: {
                    message: 'Solicitud incorrecta .session Creación fracasó'
                }
            },
            BatchCreationFailed: {
                status: 400,
                responseData: {
                    message: 'Error al crear el lote'
                }
            },
            SecurityQuestionsPasswordReset: {
                status: 400,
                responseData: {
                    message: 'For your protection this request cannot be completed online. Please contact your bank support.'
                }
            },
            BatchExistsFailed: {
                status: 400,
                responseData: {
                    message: 'Lote Ya exists.Please Cambie el nombre del lote'
                }
            },
            FileUploadFailed: {
                status: 400,
                responseData: {
                    message: 'Carga de archivos Rechazado. Por favor, sube el archivo de texto'
                }
            },
            BatchRetrieveFailed: {
                status: 400,
                responseData: {
                    message: 'Lotes no disponible'
                }
            },
            BankPolicySaveFailed: {
                status: 400,
                responseData: {
                    message: 'La política del Banco no se pudo guardar'
                }
            },
            BatchAuthorizeFailed: {
                status: 400,
                responseData: {
                    message: 'Error al autorizar al lote'
                }
            },
            BatchEmptyAuthorizeFailed: {
                status: 400,
                responseData: {
                    message: 'Error al autorizar al lote vacío'
                }
            },
            BatchDeAuthorizeFailed: {
                status: 400,
                responseData: {
                    message: 'Error al Retirar autorización del Lote'
                }
            },
            OperationFailed: {
                status: 400,
                responseData: {
                    message: 'Error en la operación'
                }
            },
            NoRecordsFound: {
                status: 400,
                responseData: {
                    message: 'No hay Recors encontrados'
                }
            },
            SameReminderFailed: {
                status: 400,
                responseData: {
                    message: 'Recordatorio ya está definido para la fecha seleccionada'
                }
            },
            SameAlertFailed: {
                status: 400,
                responseData: {
                    message: 'Alerta ya está establecido'
                }
            },
            TransactionLimitFailed: {
                status: 400,
                responseData: {
                    message: 'Has superado el límite por Día'
                }
            },
            RecipientCreationFailed: {
                status: 400,
                responseData: {
                    message: 'No se pudo crear el Receptor'
                }
            },
            RoutingNumberFailed: {
                status: 400,
                responseData: {
                    message: 'Por favor, introduzca un número de ruta del banco destinatario válido'
                }
            },
            IntermediateRoutingNumberFailed: {
                status: 400,
                responseData: {
                    message: 'Por favor, introduzca un número de ruta del banco intermediario válido'
                }
            },
            RecipientRetrieveFailed: {
                status: 400,
                responseData: {
                    message: 'Receptor no disponible'
                }
            },
            EmailNotFoundFailed: {
                status: 400,
                responseData: {
                    message: 'Dirección de correo electrónico no es válido'
                }
            },
            SessionTimeout: {
                status: 401,
                responseData: {
                    message: 'Sesión ha caducado. Por favor ingresa de nuevo'
                }
            },
            ConfigurationFailed: {
                status: 400,
                responseData: {
                    message: 'Configuración ya creado'
                }
            },
            IncorrectOTPFailed: {
                status: 400,
                responseData: {
                    message: 'OTP incorrecta Mención'
                }
            },
            OTPServiceNotRegisteredFailed: {
                status: 400,
                responseData: {
                    message: 'El Servicio Otp no está registrado. Por favor, consulte los servicios disponibles'
                }
            },
            LimitProfileExistsFailed: {
                status: 400,
                responseData: {
                    message: 'Límite ficha está Con Nombre Dada'
                }
            },
            LimitProfileListFoundFailed: {
                status: 400,
                responseData: {
                    message: 'No Perfil Existir'
                }
            },
            NoCustomersFound: {
                status: 400,
                responseData: {
                    message: 'No se han encontrado Clientes'
                }
            },
            AccountAlreadyExist: {
                status: 400,
                responseData: {
                    message: 'Cuenta ya existente'
                }
            },
            AccountNotAllowedForTransfer: {
                status: 400,
                responseData: {
                    message: 'Cuenta no permitido para Transferencia'
                }
            },
            OwnAccountNotAllowedAsRecipient: {
                status: 400,
                responseData: {
                    message: 'Cuenta Propia no permitida Para Terceros destinatario'
                }
            },
            LimitProfileLinkedAccessTypeFailed : {
                status: 400,
                responseData: {
                    message: 'Límite perfil está vinculado con el tipo de acceso, no se puede eliminar'
                }
            },
            LimitProfileLinkedUserFailed : {
                status: 400,
                responseData: {
                    message: 'Límite perfil está vinculado con los usuarios, que no se puede eliminar'
                }
            },
            CreateAlert : {
                status: 400,
                responseData: {
                    message: 'Failed to setup the Alert'
                }
            },
            UpdateAlert : {
                status: 400,
                responseData: {
                    message: 'Failed to update the Alert'
                }
            },
            DeleteAlert : {
                status: 400,
                responseData: {
                    message: 'Failed to delete the selected Alert(s)'
                }
            },
            CustomerAlreadyRegistered: {
                status: 400,
                responseData: {
                    message: 'Cliente ya está registrado'
                }
            },
            thirdPartyDeletionFailed: {
                status: 400,
                responseData: {
                    message: 'Seleccionado de Terceros ( s ) tiene instrucción de transferencia pendiente ( s ) , no se puede eliminar .'
                }
            }
        }
    };
})();