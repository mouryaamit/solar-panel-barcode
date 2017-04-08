(function(){

    module.exports = function(config){
        return {
            NoRecordFound: {
                status: 400,
                responseData: {
                    message: 'Ningún record fue encontrado'
                }
            },
            ZZ:{
                status: 400,
                responseData: {
                    message: "Respuesta básica falló"
                }},
            1001:{
                status: 400,
                responseData: {
                    message: "Cuenta no"
                }
            },
            1002: {
                status: 400,
                responseData: {
                    message: "Información propietario de la cuenta no está disponible"
                }
            },
            1003:{
                status: 400,
                responseData: {
                    message: "Estado de cuenta no válido"
                }
            },
            1004:{
                status: 400,
                responseData: {
                    message: "Saldo insuficiente"
                }
            },
            2001:{
                status: 400,
                responseData: {
                    message: "Información del cliente no está disponible"
                }
            },
            3001:{
                status: 400,
                responseData: {
                    message: "Tnformación de la transacción no disponible"
                }
            },
            3002:{
                status: 400,
                responseData: {
                    message: "La acción solicitada no es posible"
                }
            },
            4001:{
                status: 400,
                responseData: {
                    message: "Institución no está disponible"
                }
            },
            9001:{
                status: 400,
                responseData: {
                    message: "La acción solicitada no es posible"
                }
            },
            9999:{
                status: 400,
                responseData: {
                    message: "Error general"
                }
            },
            9000:{
                status: 400,
                responseData: {
                    message: "Error de validacion"
                }
            },
            9002:{
                status: 400,
                responseData: {
                    message: "El campo obligatorio no incluido"
                }
            },
            500:{
                status: 400,
                responseData: {
                    message: "Core no está disponible"
                }
            },
            RF:{
                status: 400,
                responseData: {
                    message: "Core no está disponible"
                }
            },
            00:{
                status: 400,
                responseData: {
                    message: "Éxito"
                }
            },
            AuthorisationFailed: {
                status: 400,
                responseData: {
                    message: 'No tiene permisos para acceder a este servicio . Por favor, póngase en'
                }
            },
            UserCreationFailed: {
                status: 400,
                responseData: {
                    message: 'Nombre de usuario no disponible'
                }
            },
            UserNotFoundFailed: {
                status: 400,
                responseData: {
                    message: 'Nombre de usuario no válido'
                }
            },
            UserIDNotFoundFailed: {
                status: 400,
                responseData: {
                    message: "ID de usuario del destinatario no válido"
                }
            },
            UserNotEnrolledFailed: {
                status: 400,
                responseData: {
                    message: 'Ha olvidado la contraseña no es aplicable para los clientes que no están inscritos'
                }
            },
            SecurityQuestionsPasswordReset: {
                status: 400,
                responseData: {
                    message: 'Para su protección esta solicitud no se puede completar en línea . Por favor, póngase en contacto con el apoyo de los bancos'
                }
            },
            EmailNotFoundFailed: {
                status: 400,
                responseData: {
                    message: 'Dirección de email no es válida'
                }
            },
            UserIdComplianceFailed: {
                status: 400,
                responseData: {
                    message: 'Por favor inserte un nombre de usuario válido'
                }
            },
            PasswordComplianceFailed: {
                status: 400,
                responseData: {
                    message: 'Por favor introduce una contraseña válida'
                }
            },
            NewInfoFailed: {
                status: 400,
                responseData: {
                    message: 'Por favor, introduzca la nueva ID de usuario / contraseña'
                }
            },
            UserExistsFailed: {
                status: 400,
                responseData: {
                    message: 'Nombre de usuario no disponible'
                }
            },
            InCorrectPasswordFailed: {
                status: 400,
                responseData: {
                    message: 'La contraseña introducida es incorrecta'
                }
            },
            SamePasswordFailed: {
                status: 400,
                responseData: {
                    message: 'La contraseña introducida recientemente se ha utilizado . Por favor, introduzca una nueva contraseña'
                }
            },
            UserSQValidationFailed: {
                status: 400,
                responseData: {
                    message: 'Respuesta incorrecta a la pregunta de seguridad'
                }
            },
            InCorrectRetryError: {
                status: 400,
                responseData: {
                    message: 'Debido a múltiples intentos de entrada incorrectos , su cuenta está bloqueada.'
                },
                nextStep: config.nextStepTo.goToLogin
            },
            AccessTypeFoundFailed: {
                status: 400,
                responseData: {
                    message: 'Tipo de acceso incorrecto'
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
                    message: 'Nombre de usuario o contraseña incorrecta'
                }
            },
            UserLoginFailedLocked: {
                status: 400,
                responseData: {
                    message: 'El usuario está bloqueado. Por favor, póngase en contacto con un administrador'
                }
            },
            UserLoginFailedDeleted: {
                status: 400,
                responseData: {
                    message: 'El acceso del usuario ha sido revocado. Por favor, póngase en contacto con un administrador '
                }
            },
            MultipleLoginError: {
                status: 400,
                responseData: {
                    message: 'Ya se ha identificado. Múltiples inicios de sesión no se le permite'
                },
                nextStep: config.nextStepTo.goToLogin
            },
            InCorrectRequestError: {
                status: 400,
                responseData: {
                    message: 'Se proporcionó solicitud incorrecta'
                }
            },
            SessionCreationFailed: {
                status: 400,
                responseData: {
                    message: 'Solicitud incorrecta . No se puede crear la sesión'
                }
            },
            BatchCreationFailed: {
                status: 400,
                responseData: {
                    message: 'No se puede crear el lote'
                }
            },
            BatchExistsFailed: {
                status: 400,
                responseData: {
                    message: 'Nombre del lote ya existe . Por favor, cambiar el nombre de lote'
                }
            },
            FileUploadFailed: {
                status: 400,
                responseData: {
                    message: 'La carga de archivos rechazada . Por favor, sube el archivo de texto'
                }
            },
            BatchRetrieveFailed: {
                status: 400,
                responseData: {
                    message: 'Lote no disponible'
                }
            },
            BankPolicySaveFailed: {
                status: 400,
                responseData: {
                    message: 'La política del banco no se pudo guardar'
                }
            },
            BatchAuthorizeFailed: {
                status: 400,
                responseData: {
                    message: 'No puede autorizar por lotes'
                }
            },
            BatchEmptyAuthorizeFailed: {
                status: 400,
                responseData: {
                    message: 'No puede autorizar el lote vacío'
                }
            },
            BatchDeAuthorizeFailed: {
                status: 400,
                responseData: {
                    message: 'No es posible anular la autorización del lote'
                }
            },
            OperationFailed: {
                status: 400,
                responseData: {
                    message: 'Operación fallida'
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
                    message: 'El aviso ya está establecido'
                }
            },
            TransactionLimitFailed: {
                status: 400,
                responseData: {
                    message: 'Se ha superado el límite por día'
                }
            },
            RecipientCreationFailed: {
                status: 400,
                responseData: {
                    message: 'No se puede crear destinatario'
                }
            },
            RoutingNumberFailed: {
                status: 400,
                responseData: {
                    message: 'Por favor, introduzca un número de identificación del banco destinatario válido'
                }
            },
            IntermediateRoutingNumberFailed: {
                status: 400,
                responseData: {
                    message: 'Por favor, introduzca un número de identificación del banco intermediario válido'
                }
            },
            RecipientRetrieveFailed: {
                status: 400,
                responseData: {
                    message: 'El destinatario no está disponible'
                }
            },
            SessionTimeout: {
                status: 401,
                responseData: {
                    message: 'Sesión ha expirado . Por favor, inicie sesión de nuevo'
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
                    message: 'Mención incorrecta OTP'
                }
            },
            OTPServiceNotRegisteredFailed: {
                status: 400,
                responseData: {
                    message: 'El servicio de OTP no está registrado. Por favor, compruebe los servicios disponibles'
                }
            },
            LimitProfileExistsFailed: {
                status: 400,
                responseData: {
                    message: 'perfil límite existe con nombre dado'
                }
            },
            LimitProfileListFoundFailed: {
                status: 400,
                responseData: {
                    message: 'No existe ningún perfil'
                }
            },
            AccountAlreadyExist: {
                status: 400,
                responseData: {
                    message: 'La cuenta ya existe'
                }
            },
            AccountNotAllowedForTransfer: {
                status: 400,
                responseData: {
                    message: 'La cuenta no está permitido para la transferencia de'
                }
            },
            OwnAccountNotAllowedAsRecipient: {
                status: 400,
                responseData: {
                    message: 'Cuenta propia no permitido para los terceros destinatarios'
                }
            },
            LimitProfileLinkedAccessTypeFailed : {
                status: 400,
                responseData: {
                    message: 'Perfil límite está relacionado con un tipo de acceso . No se puede eliminar'
                }
            },
            LimitProfileLinkedUserFailed : {
                status: 400,
                responseData: {
                    message: 'Perfil límite está enlazado con los usuarios. No se puede eliminar'
                }
            },
            CreateAlert : {
                status: 400,
                responseData: {
                    message: 'No se puede configurar de alerta'
                }
            },
            UpdateAlert : {
                status: 400,
                responseData: {
                    message: 'No se puede actualizar de alerta'
                }
            },
            DeleteAlert : {
                status: 400,
                responseData: {
                    message: 'No se puede eliminar de alerta'
                }
            },
            CustomerAlreadyRegistered: {
                status: 400,
                responseData: {
                    message: 'Este registro de cliente ya existe'
                }
            },
            EODExtractNotAvailable: {
                status: 400,
                responseData: {
                    message: 'Extracto no disponible EOD'
                }
            },
            StatementsNotAvailable: {
                status: 400,
                responseData: {
                    message: 'Las declaraciones no disponibles'
                }
            },
            InvalidCaptcha: {
                status: 400,
                responseData: {
                    message: 'Captcha inválido'
                }
            },
            NoCustomersFound: {
                status: 400,
                responseData: {
                    message: 'No se encontraron clientes'
                }
            },

            NoRecordsFound: {
                status: 400,
                responseData: {
                    message: 'No se encontrarón archivos'
                }
            },
            thirdPartyDeletionFailed: {
                status: 400,
                responseData: {
                    message: 'Seleccionado de Terceros (s) tiene instrucción de transferencia pendiente(s),no se puede eliminar.'
                }
            },
            UnauthorizedAccess: {
                status: 401,
                responseData: {
                    message: 'Acceso no autorizado'
                }
            },
            genericMessage: {
                status: 400,
                responseData: {
                    message: 'No se puede procesar. Por favor, póngase en contacto con el Banco.'
                }
            },
            TempPasswordExpired: {
                status: 400,
                responseData: {
                    message: 'contraseña temporal expiró. Por favor, póngase en contacto con el Banco.'
                }
            },
            TempUserIdExpired: {
                status: 400,
                responseData: {
                    message: 'Identificación del usuario temporal expiró. Por favor, póngase en contacto con el Banco.'
                }
            },
            NoActiveUsers: {
                status: 400,
                responseData: {
                    message: 'No hay usuarios activos.'
                }
            },
            TransferAlreadyExistForGreaterAmount: {
                status: 400,
                responseData: {
                    message: 'Transfer Already Exist for Greater Amount.'
                }
            }

        }
    };
})();