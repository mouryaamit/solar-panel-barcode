(function(){

    var moment = require('moment');

    function EmailTemplate (config , tnxId){
        this.config = config;
        this.tnxId = tnxId;
    }

    EmailTemplate.prototype = {
        generic : function(){
            return '<p>Dear Customer,</p><p>Wishing you the best.</p>';
        },
        invalidLoginHeaders: function(){
            return '<br/><table>'+
                '<thead>'+
                '<tr>'+
                '<td style="font-size: 13px;border-left: 1px solid black;border-right: 1px solid black;border-top: 1px solid black;border-bottom: 1px solid black;">Date</td>'+
                '<td style="font-size: 13px;border-right: 1px solid black;border-top: 1px solid black;border-bottom: 1px solid black;">Time</td>'+
                '<td style="font-size: 13px;border-right: 1px solid black;border-top: 1px solid black;border-bottom: 1px solid black;">User ID</td>'+
                '<td style="font-size: 13px;border-right: 1px solid black;border-top: 1px solid black;border-bottom: 1px solid black;">IP Address</td>'+
                '<td style="font-size: 13px;border-right: 1px solid black;border-top: 1px solid black;border-bottom: 1px solid black;">Valid User ID</td>'+
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
                '<td style="font-size: 13px;border-left: 1px solid black;border-right: 1px solid black;border-top: 1px solid black;border-bottom: 1px solid black;">Date</td>'+
                '<td style="font-size: 13px;border-right: 1px solid black;border-top: 1px solid black;border-bottom: 1px solid black;">Time</td>'+
                '<td style="font-size: 13px;border-right: 1px solid black;border-top: 1px solid black;border-bottom: 1px solid black;">User ID</td>'+
                '<td style="font-size: 13px;border-right: 1px solid black;border-top: 1px solid black;border-bottom: 1px solid black;">Subject</td>'+
                '<td style="font-size: 13px;border-right: 1px solid black;border-top: 1px solid black;border-bottom: 1px solid black;">Amount</td>'+
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
                '<td style="font-size: 13px;border-left: 1px solid black;border-right: 1px solid black;border-top: 1px solid black;border-bottom: 1px solid black;">Customer Name</td>'+
                '<td style="font-size: 13px;border-right: 1px solid black;border-top: 1px solid black;border-bottom: 1px solid black;">User ID</td>'+
                '<td style="font-size: 13px;border-right: 1px solid black;border-top: 1px solid black;border-bottom: 1px solid black;">Created On</td>'+
                '<td style="font-size: 13px;border-right: 1px solid black;border-top: 1px solid black;border-bottom: 1px solid black;">Last Login</td>'+
                '<td style="font-size: 13px;border-right: 1px solid black;border-top: 1px solid black;border-bottom: 1px solid black;">Password Expires</td>'+
                '<td style="font-size: 13px;border-right: 1px solid black;border-top: 1px solid black;border-bottom: 1px solid black;">Invalid Login Attempts</td>'+
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
            return '<br/><br/><p>Thanking you,</p>'+
                '<p>Yours Sincerely,</p>'+
                '<p style="font-weight: bold">'+ this.config.bankName +'</p>'+
                '<div>'+
                    //'<p><img src="data:image/jpg;base64,/9j/4AAQSkZJRgABAgAAZABkAAD/4QBgRXhpZgAASUkqAAgAAAACADEBAgAHAAAAJgAAAGmHBAABAAAALgAAAAAAAABQaWNhc2EAAAMAAJAHAAQAAAAwMjIwAqAEAAEAAAA9AAAAA6AEAAEAAAA4AAAAAAAAAP/uAA5BZG9iZQBkwAAAAAH/2wCEAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQECAgICAgICAgICAgMDAwMDAwMDAwMBAQEBAQEBAgEBAgICAQICAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDA//AABEIADgAPQMBEQACEQEDEQH/xACmAAAABgMBAQAAAAAAAAAAAAABBgcJCgsCBQgEAwEAAAcBAQEAAAAAAAAAAAAAAAIEBQYHCAMJARAAAAYBAgQDBQcDBQAAAAAAAQIDBAUGBxEIABITCSExFEFhcbEV0UJSkiMWCsEiF1GhQyQYEQACAQMDAwIDBgQEBwEAAAABAgMRBAUAEgYhEwcxQVEiCGFxgZEyFKEjFRbw4UJSscHRYqKyNBf/2gAMAwEAAhEDEQA/AJ+gJp6B+mTyD7hfs4GhoRTTD/jJ+Uvj/twNDUeHfL/Ip2r7a7jJYb22Uma3u5viDPGdijcVTcZG4ookq0cKNFIu4ZXUaTEctKoLJGFVtEtZAiQkFNZZBT+0F11a4/DWH9W5Re2+MxhI2tMaM9f9kf6mr7U9T6V10w2P5ByzJHDcKx1zlsqoqywKWWMVpWST9CCoPViPQkaZRvPfm7wWQ5Q8rSK/tJ2/QJw/6dWGn2LJc23JzGMX6tYpiXcMXLoSCAG9O1bp+GoFDXQKxvvOniHGOYIlyl8QSN6rHEpp8BI6mnwr11f+K+kXzjlIBc3s+ExpYD+W8kkrivx7cTLX7mI+3Rvxd/Ia7oGKHRVM4YE247n6v6hAzv8AxytP4cvjZolqLv0SjpeyV5+ssmOpCfTAHnKAagA8LsR5g8QcgkWH91e4uZugNxGHjqfi0RbaPtNBpr5D9LnnfjNq15bW2PzUK9StpKRMAPhHKse6vttJavTbqRT28e87s77hapaJV5SSwxuNZILqzu27MBWMDkAoNA53LymvOcsNkOJIjqrzRygvUUQFRw0bl8eLDnxsiWiZKykju8RKKpPCweNgftHp+P8AHVDGeW2vpMTlYZbLNQsVkt5lKSKwJqKMBXTunTT/AAE/KX7OG7SrQdNPUP0yeQ/cL7vdwNDWYeQfAPlwNDURL+QB3M8kP8jKdsLavbZKjy7utRNp3bZnq0m7ZWSmVKfbg+hcN1p20FuePmLjDOW7uWcJLlWBg6QbFEpVnXKm5FyfFeOuKvzPMKstyz9uzt2IAml+Lf8AYnq35VrTUs8ceO8z5g5xFwjESNb42Ne7f3KjcbeChoADTdJKfliWtS3U/Kraj941xdVKLBtq9UYlnGR7cqYLAgVMzp64IQpDPJJwAdV28U01MY/lroUADQOPO3nHkLP8xy0mU5BdyT3RrtG75I1J6JGtaIq+goBUDr769euDeO+K+OcFFx/h1lDZ46MDeVX+ZLJQAvLJ1aR6ipLFqE1FB00sKFbKIAHIXm5eblHTXT/XQPP48VzJnaNRm/j/AMv8tTfte/uf8H/PXjfV9MhTAIJlHxEQESAIeHh4agIahx2t82N1N9BWp6/49NfeyzL8gJHtQdKflpAcjYySlpGFt1am5Gg5UpMkysWPMoVV6rC2+oWSIVK7h5FjLsFUH5U2zpMpuUD6kDxIID53t4q8w5jgOSTtyd/jzmk9o7fynQnqUDdEmAJIdQN3o1R01RfmXwVxXzBg5I72FbblcasbW/jSkqSAUVZGFDJFUAMjbqeq0Irqab2Oe6BM79sIWLGOeHUcw3k7blWFbzNHNUkmZL7W3RASp+Zohm1RRj0m1rIkdCRRa/otpNExykSQctiBvGdsZfWNtyHASd7AX0Xcib3BqQ0be4ZCCGB9CPx15MXuKznGszecT5TCYOSY6YxTIfegBWRSOhV1IZWHQgg6fN9ofAf6cIq9K6JopX24RuPaJc79M6hD0eo2K4Swl05vptahnk0+5dfDX0rI+nHSKMzSrCv6mYAfiaa5yuIomlPoqk/kK6rV9hVvq2W88Ru5jdO0nLzDbgtws9l/NaLRGTmZuWrUpYn66EOg2ZnGYdw0WiUqfpEDc4R5BSTAP7Q4zb5+5JjZfLdlgMuJH4xiI4YXjjDMW3KZZiEWpZtxUHaNxQGmt6/TRw/NYv6dchyPjbxw83z8k80U0hVQO2/YhTuN0UARu6bvkWR6npTUgrdDUn91wTlG90Sh7TMxYHibpFymO81beK9CYxyBgWsnmvSNqTkehs4aPsckSQYKItHHrjrCkqIuDG8SgnUXlRbq54df5jF22EyPGIpkaG6s1WC4sk3Be1PEoDtuB2kvXaSWJ6jUt8SXlpjed4vDZu+5JiuZy27x3VjkpHuLXIyBd3etrhmMabXBcKg+agQE0NeiG202nt9n73b+GIEzZqJtsZbpD5bVqyxn5rsrYxnnWMGtxGL5QM3pKJG/04rj74jyibUeO8/BrP8A/NJOFrjmPLRx8ZYXnZavf7nc/aCbbSvYWhi3V6npXUZTyflW8tJz9spt4e3I2w5sRMtBbdvti8aAP6GZtwlKf6QK015arCQNE2V7TLNV2WxaqWS3x2SlLbP7rKQylJG3DEW1ynEft6QRr8o7duI1uqJHPWMXlTMgBfABADcXljs/EfGMvjv7Wtr68S4Mr5SJS0u2VgojNNxIPRifbbTR+T3Ut/5s5Xiso3M7vH20tqIYsNO4WHfCpburuCqrDqtPcNXWjUawtP2hbSbtV4/tz0Oz5GiMqzN2ld1GPI5we2u2d2WPHFo67StyzpRnDJPlElSLHDpN1GpCCIF8JdiJIYOA4HI2i8bt7u7ineZr2JaysJjtERoSVX5gamtCumq/ne78o8lxGTk5xeY6yltEtxi55CYgYF3G4BagZqAggCrBzpg7YLm6S2v93vatlOPM0QgNyNzmtrOUo2JMeOgHzHKEimFQftG6AAn6OCuoRqzRM5RAjZqUgcvmFu/TpyGTO8YzXE7sqf2LfvYdtaAMxSVE69I6iqgf7ifXUG+srh1thM9x3n1mrob+L+n3G8/OzRIrQNIfeQIxVia9VpXpqxa9ofAfmHFr9afbrKWubt5ENI2LaFunr8QVQ0rObb83w8YRLUVTyEljKzs2REwDxE53CxQD3jwrsCFv4Gb9IlQn8GGkt8peymRerNE4/NTqu97XVsytW222+2YAi3M1lirNnUhVohpFkmjPHkMjOBPNnkWqoiR3H/Rk3fqyidPkbgcwGKJQMGNfL55LifO2RusEhfNreCaFaBgwMSkVDEArsLBuo+8U16b+Hzw7O/StibLlUqQ8XfGmC4k3bdjLcstVIVir95F2mhqTT/VTT1LvcFmNGvZ0qMBtHouH4ubk6hkjdQlWa1kQV5uHRsKU7C/udxZrRLEp1Gscs9MYpYwqKS6Lo/RVBMwm4qDkfMOWpZZXGY/j1nZW0kkNzlO1HL86LIrp3GZyscTt7pTcGPWnXUlw/AODzX+FyWR5Zf5O5Ec9phjK8FI2aMpKIFWNWeeFOo7w+V1UkVoCvkJuP30Nc5f5UdQuRTSbxeEuCOJXH7t/xgNevUU/i6myaVA8uCAVmYYM1vQGKcTnVbmU5+oUR4h8/PfP1r5AHKY4r4sdlwtgXl/ZGC4SSOFeyHC9pwGKCu7eu730R/Hf08T8A/tcXGPVVMlsciFi/eie2kV7h+8U3dxWaMPVdgjcilBpDMtTOf8AOlAxPitphN0lBY4Wu01R2dSgJpaUdtMmIvcnLNnSTp8+Mdo3rkeq8YEKmkoMal1B5w0MLLfT+Q+ZYPFcbkw3as8c9xLAsKNuIui10VZXZtojiV2jqATEoNCaVlfH4PG/Ac9l+W/17u3uQigiuTNIuwNZ0st4KIKlp2WOVqt/Nb5aCtNRX86ZhuWLcSYSf7JcS7hIHEFPcSmPnt3rOQHkqjWr5Mul05IrqGvVdjF1LTJxhm7NIhOu9Oz6aCZzlMA2/wAT5Nye64/jON3PHLHJWOPt6wPMj7u3IzHdXeq1ZgQqihO00r11DeT8N4XjuTZTl0HM8nhL7K3my4W3kj2GWCNNyU7TSERq+5nb5UD/ADEVGmW0I99bN8Gw+uxEQnCTth364YXYQDFB02Sr4M8hxr6QjGrZ4dV81ZwCBhSAixjKppI6HETAI8aH+l6OU8h5DevGIokxcgZAKBC81QgH2UPv7U1Tn1tzQQ+PeMYtZ2uLpswhSVyC8ixwdZSV6EtvqxHQlgR0OrNz2h8B+YcaD1hrXyWQRdN1WzlJNdu4ROgugqUDpLIrEFNVJQhgEp01CGEBAfAQHgdQaj118IBFD6art6ZVz9oXueZU2/ZDgJWw02pTWRskYM+nfS2h7pg3N1Ts8PC/R1rTHSdfkpOkKzx2r9u4bOWiruNdJmKdMBAar85Yw2eWxvl21hea0/bm0vVShZJBHJFFI25WRVZWAq4IZlAIJbWovpqzSco4RmPp8uriO3yzXS32PaQN25IhPDNPEO2yyllKbqRkFd7uCCtQ4Kh3D8fLyk6i2wg/kKpkNvC17KiVgt6bewWeoVrDp8RwjaGaU9pWqRW3qaEzKyAME4w0ExcLNvRtETNwOOVsn5Lse7PF/Te5Y3qCK53ykSSwpbNbRqBGFjDbHaQqV2K20qoIGtS2/gnNiG3d8yIcnj5Hlsu1EWihmlvDdyF2mMlxIKpFH3e53nUPvdlbSi07uQQ0KCx5PHk3LuI+2Y6k6i+PYYwz2Ip9LgGjd/UXxXLJZq9Qd2tBeTZiBOk39c4TMUwH4YbXy2lmzPNYySywz27QOXUmOGCMAxOrKQwEh7iUHyiR1Pr0Lk/p9ur1QttkoYUltrpLhe1Jtee4dys6UYEUhIjkqSW7aN6jSf8A/vSOh1bbZYWo2GKv10evbjLTLSfYhFxOS3+F7JjBxPVtodsZyxgRnZZvMIR5jcrRNNRokPS6XKgtPI3YubjJ2lrJFmbyY3DsJAUW5Nm9szRgiojqyyLGSQtCg9iH9/C808FtiL27gmwNnCLZEaNg7Wgv4bwJKwNHlKRvCZR1cskrDfuqT7nvrw7eZ2OC/wCELB+y46Sw/ewrFRnqwRB5kjHKN2JZmj2NsMO/i3GNrge+vDtGhek/hVCpnQVMICHE4t+e4fKTRJeY9lska2lEcbJtNxD3O4CrrTsyGVyiDrE5FGOmi28M8ow9tL/R8vC2XlS8tzLMktRa3BgMbB0aq3MPYQO9Cs4LK6gEkEHsi4CW3l90y57sRqp0dvOzkt0fVBwuDiRr7jPuTl3yMLX4aXVDozb3HdRlHDhZYDGUQVRZqmABXII7M8XccHEOAzZK4hNtmeQXLXBiP64rQE9iNgaEN+otUCu73IOsI/UHzb+8vIFpxqyuVu8DxWzS0MykbJ73YouZV2kr+pQnRiAUIGp2HtD4D/TiSU+Wmqhr76EPIPgHy4NoaaO7tnaopHcrxPBqQk3H4r3SYjXVlsCZyMycuDwK66pF5akW5NgIPJOgWrpFBwmUqqrFyUjpEhxKqiuttbm1W3mxuUhS6wl0hSeF+qOp+I+I9R8DQ9KVHNJMjY39vm8HcPaZ+zkElvOn6o3H8CD6EEEEEggjpqDXkJ3mfaPkNTB29zGM7gHJzNV03iZ2caqGxlk1nHuDMz2fH10bpqQMvFPjpgqHSWMVIFAKp0lNUi5W8ifTZlbcyZvx6zZTA1J7I/8ApgDGuxk69xVHRXHzkA1GvQvxL9YXGeQQxcf8oBcLypQFM7GtlcEAfzFegMTuerI/yAkBH9RpRYm7R0s2K5iZJjKNjFASuY162foGAwalEFGqipPEB18+Mw5DiWSxlwYMjbTQTVptkjdD+O4D/r9mtgY3N4vMW63eIuYLu1IqHhkjkWn3qxH5E609oybWqw1VdWOxwsEgmQ5znlZNozMJSlAw8iSypVlDaewpTCPsDhywPA8/nrpbfB2NzczMQAI43b8yAQB95018h5txLito13yXJ2NjaoCSZpo0PT4KW3H8AfxPTRi2t7Wt2HdFuiFA2rVWcp2EVJA0fk7eBcIJ8wxvWoEpzITDKgC7KzWvNxOXnRQZsDmVKtp1zNEeZwTY3jP6f7XiTw8n8jtHJfIFeHHq25t4IZWuGHy7RQURSev6iaU1gXzV9Wb8ls7jhXh8TR2cu6O4yjgqDGQVdLVT8w3gkGZtrbD8iiu7VgXsr2c4Y2HbdqLtswVDrx1LpqDhy8lJNQjmyXO1yxyObLd7Y/TTSK/sVifh1FTFKVJFIqaCJSIIpkLd1/f3GTu3u7ojuMfT2A9gPsGsd2VnFYW620P6B7+5PuT9+uq/aHwH5hwj0r1gCiegfqE8g++X7eBoaHqJ/jJ+Yv28DQ0kmZsEYO3FU9xj/PGKsdZgpTkxlD1nItUg7bEprmLyC7aNplm7Bg+KTwKugKaxfYYOO0FzcWr9y1do5PipI/4a4z29vcp27hFdPgRXTNmQv41vaWuz9eSr2Hr5h1w5VMq4SxBmrIdbjlTGNzGKWHmJqyRDZPUR0KigmBAHQoAAAAOx5FkZKG6W3nYe8sMTkfiVrpHBjIrRibCW5thX0imkjH5Kw0fsPfx6O0ph+SYzobZWeVLCwUQXRmM43q65UKdw3PzkWcV+xTqlPciJgDUp40U/ANCh46huR5URdi3ZIISeoiRI/wD1UH+Oivh7KeXv3ncuJvjLI8h/82OnkKtWKnR6/E1Kl1+u1CqQDMkfA1mrxMZX69CMEhMKbGIhYlu0jY1mmJh5UkUiEDUdA4ZXd5XMkrFnPqT1P5nqdOSIqKEQAKPQDoB9wGjB1E/xk/MX7eC6NoOonqH6hPIfvl93v4Ghr//Z"/></p>'+
                '<p><img style ="float: left" src="cid:imageEmailTemplateEnd"/>Important : '+ this.config.bankName +' will never send e-mails that ask for confidential information. If you receive an e-mail/call requesting your Internet Banking details like your PIN, password, account number, please do not respond. 	This is an automatically generated e-mail. Please do not reply back to this message.</p>'+
                '</div>'+
                '<br/>'+
                '<p><b>DISCLAIMER</b>:</p>'+
                '<p>The contents of this message and any attachments are confidential and are intended solely for the attention and use of the addressee only. Information contained in this message may be subject to legal, professional or other privilege or may otherwise be protected by other legal rules. This message should not be copied or forwarded to any other person without the express permission of the sender. If you are not the intended recipient you are not authorized to disclose, copy, distribute or retain this message or any part of it. If you have received this message in error, please notify the sender and destroy the original message. We reserve the right to monitor all e-mail messages passing through our network. To know more about our products, visit our website <a href="'+ this.config.bankSiteUrl +'">'+ this.config.bankSiteName +'</a> .<p>'
        },
        updateInfo: function(data){

            var newDated = new Date();
            var updateTemplate = '<p>Update personal info request details are given below.</p>'+
            '<p>Request Date & Time – '+ moment(newDated).format("dddd, MMMM D, YYYY h:mm:ss A") +'</p>'+
            '<p>Update personal Info Details</p>';

            if(data.AddressLine1 != '') updateTemplate = updateTemplate +'<p>Address Line 1 – '+ data.AddressLine1 +'</p>';
            if(data.AddressLine2 != '') updateTemplate = updateTemplate +'<p>Address Line 2 – '+ data.AddressLine2 +'</p>';
            if(data.city != '') updateTemplate = updateTemplate +'<p>City – '+ data.city +'</p>';
            if(data.state != '') updateTemplate = updateTemplate +'<p>State – '+ data.state +'</p>';
            if(data.zip != '') updateTemplate = updateTemplate +'<p>Zip Code – '+ data.zip +'</p>';
            if(data.country != '') updateTemplate = updateTemplate +'<p>Country – '+ data.country +'</p>';
            if(data.homePhone != '') updateTemplate = updateTemplate +'<p>Home Phone – '+ data.homePhone +'</p>';
            if(data.workPhone != '') updateTemplate = updateTemplate +'<p>Work Phone – '+ data.workPhone +'</p>';
            if(data.cellPhone != '') updateTemplate = updateTemplate +'<p>Cell Phone – '+ data.cellPhone +'</p>';
            if(data.emailId != '') updateTemplate = updateTemplate +'<p>E-Mail ID – '+ data.emailId +'</p>';

            return updateTemplate;
        },
        wireTransfer: function(data){

            var wireTemplate = '<p>Wire transfer request details are given below.</p>'+
                '<p>Request Date & Time – '+ moment(data.updatedOn).format("dddd, MMMM D, YYYY h:mm:ss A") +'</p>'+
                '<p>Sender Information</p>'+
                '<p>Account – '+ data.fromAccount+'</p>'+
                '<p>Amount - $ '+ data.amount +'</p>'+
                '<p>Beneficiary Information</p>'+
                '<p>Beneficiary Name – '+ data.beneficiary.beneficiaryName +'</p>'+
                '<p>Beneficiary Account – '+ data.beneficiary.recipientBankInfo.accountNo +'</p>';

            if(data.beneficiary.specialInstruction.instruction1) wireTemplate = wireTemplate + '<p>Special Instructions1 – '+ data.beneficiary.specialInstruction.instruction1 +'</p>';
            if(data.beneficiary.specialInstruction.instruction2) wireTemplate = wireTemplate + '<p>Special Instructions2 – '+ data.beneficiary.specialInstruction.instruction2 +'</p>';
            if(data.beneficiary.specialInstruction.instruction3) wireTemplate = wireTemplate + '<p>Special Instructions3 – '+ data.beneficiary.specialInstruction.instruction3 +'</p>';
            if(data.beneficiary.specialInstruction.instruction4) wireTemplate = wireTemplate + '<p>Special Instructions4 – '+ data.beneficiary.specialInstruction.instruction4 +'</p>';
            wireTemplate = wireTemplate + '<p>Beneficiary Bank Information</p>'+
            '<p>Beneficiary Bank Name – '+ data.beneficiary.recipientBankInfo.bankName +'</p>'+
            '<p>Beneficiary Bank Routing Number – '+ data.beneficiary.recipientBankInfo.bankRoutingNo +'</p>';

            if(data.beneficiary.intermediateBank.bankName || data.beneficiary.intermediateBank.bankRoutingNo) wireTemplate = wireTemplate + '<p>Intermediate Bank Information</p>';
            if(data.beneficiary.intermediateBank.bankName) wireTemplate = wireTemplate + '<p>Intermediate Bank Name – '+ data.beneficiary.intermediateBank.bankName +'</p>';
            if(data.beneficiary.intermediateBank.bankRoutingNo) wireTemplate = wireTemplate + '<p>Intermediate Bank Routing Number – '+ data.beneficiary.intermediateBank.bankRoutingNo +'</p>';

            wireTemplate = wireTemplate + '<p>Schedule Information</p>'+
            '<p>Schedule Date – '+ data.scheduledInfo.scheduledDate +'</p>'+
            '<p>Schedule Type – ' + data.scheduledInfo.scheduledType +'</p>';

            if(data.scheduledInfo.scheduledType == "Recurring") wireTemplate = wireTemplate + '<p>Frequency – '+ data.scheduledInfo.frequency +'</p>'+
            '<p>Expiration Date – '+ data.scheduledInfo.expiryDate +'</p>';

            return wireTemplate;
        },
        orderCheckBook: function(data){

            var newDated = new Date();
            var orderCheckTemplate = '<p>Check Order request details are given below.</p>'+
                '<p>Request Date & Time – '+ moment(data.updatedOn).format("dddd, MMMM D, YYYY h:mm:ss A") +'</p>'+
                '<p>Check Order details</p>'+
                '<p>Account – '+ data.accountNo +'</p>'+
                '<p>Phone Number – '+ data.phoneNumber +'</p>'+
                '<p>Starting Check Number – '+ data.startingCheckNo +'</p>'+
                '<p>Number of Boxes – '+ data.noOfBoxes +'</p>'+
                '<p>Design – '+ data.design +'</p>'+
                '<p>Style – '+ data.style +'</p>';

            if(data.comments) orderCheckTemplate = orderCheckTemplate + '<p>Comments – '+ data.comments +'</p>';

            return orderCheckTemplate;
        },
        resetPassword: function(data){
            return '<p>Dear '+ data.customerName +',</p><p>As per your request we have reset your password. Your new password is <b>'+ data.password+'</b></p><br/>' +
                   '<p>For security reasons we recommend you not to share your password with anyone including bank staff. You are requested to change this password on login.</p><br/>';
        },

        forgottenUserId: function(data){
            return '<p>Dear '+ data.customerName +',</p><p>As per your request we have retrieved your UserID. Your userID is <b>'+ data.userId +'</b></p><p>For security reasons we recommend you not to share your userId with anyone including bank staff. </p><br/>';
        },
        reminderMail: function(data){
            return '<p>Dear '+ data.customerName +',</p><p>You have set a reminder. </p><p>'+ data.reminderMessage +'</p>'
        },
        bankMailFooter: function(){
            return '';//<br/><br/><p><b>IMPORTANT/CONFIDENTIAL</b>: This transmission is intended only for the use of the addressee(s) shown. It contains information that may be privileged, confidential and/or exempt from disclosure under applicable law. If you are not the intended recipient of this transmission, you are hereby notified that the copying, use, or distribution of any information or materials transmitted herewith is strictly prohibited. If you have received this transmission by mistake, please contact sender immediately.</p>';
        },
        bankAdminPassword: function(data){
            return '<p>Your Admin Login Credentials</p><p>UserID: <b>' + data.userName +'</b></p><p>Password:  <b>'+ data.password +'</b></p>'+
                   '<p>For security reasons we recommend you not to share your password with anyone including bank staff. You are requested to change this password on login.</p><br/>';
        },
        bankAdminPasswordChanged : function(data){
            return '<p>Dear Admin,</p><p>Your Password Has Been Changed Successfully</b></p><p>For security reasons we recommend you not to share your password with anyone including bank staff. </p><br/>';
        },
        bankAdminLocked : function(data){
            return '<p>Dear Admin,</p><p>Your Profile Has Been Locked Due to multiple failed login attempts</b></p><br/>';
        },
        bankAdminLockedBySupervisor : function(data){
            return '<p>Dear Admin,</p><p>Your Profile Has Been Locked By Supervisor</b></p><br/>';
        },
        bankAdminUnlocked : function(data){
            return '<p>Dear Admin,</p><p>Your Profile Has Been Unlocked By Supervisor</b></p><br/>';
        },
        bankAdminDeleted : function(data){
            return '<p>Dear Admin,</p><p>Your Profile Has Been Deactivated By Supervisor</b></p><br/>';
        },
        bankAdminProfileChanged : function(data){
            return '<p>Dear Admin,</p><p>Your Profile Has Been Changed Successfully</b></p><br/>';
        },
        userLoginPassword: function(data){
            return '<p>Dear '+ data.customerName+', </p>'+'<p>Thank you for enrolling in Carter Bank&#39;s on-line Internet banking system!</p><br/> <p>Enclosed is your temporary password.  Please use this to sign into your account at https://www.carterbankandtrustonline.com.  You will then be asked to change your user id and password. If you are unable to access the system in the future, we would be able to reset your password to the temporary one referenced below.  Otherwise, for security and privacy reasons, we will only be able to communicate your temporary password by mail, or in person upon presentment of proper identification.</p><br/><p>Once again, thank you for allowing Carter Bank the opportunity to serve you!</p><br/><p style="text-align: center;">P/W: <b>'+ data.password +'</b></p>';
        },
        userLoginUserId: function(data){
            return '<p>Dear '+ data.customerName+', </p>'+'<p>Thank you for enrolling in Carter Bank&#39;s on-line Internet banking system!</p><br/> <p>Enclosed is your temporary user ID.  Please use this to sign into your account at https://www.carterbankandtrustonline.com.  You will then be asked to change your user id and password. If you are unable to access the system in the future, we would be able to reset your password to the temporary one referenced below.  Otherwise, for security and privacy reasons, we will only be able to communicate your temporary password by mail, or in person upon presentment of proper identification.</p><br/><p>Once again, thank you for allowing Carter Bank the opportunity to serve you!</p><br/><p style="text-align: center;"> User ID: <b>'+ data.userName +'</b></p><p style="text-align: center;">Your Temporary password will be mailed separately.</p>';
        },
        alertLoginReset: function(data){
            return '<p>ALERT:  Your login which was locked due to invalid login attempts has been reset. Please try login with your User ID & Password.</p>'+
                    '<br/><p>For any issues please contact your bank.</p>'
                    /*'<br/><p>IMPORTANT/CONFIDENTIAL: This transmission is intended only for the use of the addressee(s) shown. It contains information that may be privileged, confidential and/or exempt from disclosure under applicable law. If you are not the intended recipient of this transmission, you are hereby notified that the copying, use, or distribution of any information or materials transmitted herewith is strictly prohibited. If you have received this transmission by mistake, please contact sender immediately.</p>'*/;
        },
        alertLoginLimitExceeded: function(data){
            return '<p>ALERT:  Your login attempts have exceeded the daily limit and must be reset.  Please contact your bank.</p>'+
                '<br/><p>For any issues please contact your bank.</p>';
        },
        alertACHProcessed: function(data){
            return '<p>ALERT:  ACH batch ' + data.batchName + ' has been processed successfully for effective date '+ data.effectiveDate +'.</p>';
        },
        alertACHNotProcessed: function(data){
            return '<p>ALERT:  ACH batch ' + data.batchName + ' with effective date '+ data.effectiveDate +' has been declined.</p>';
        },
        alertACHImportProcessed: function(data){
            return '<p>ALERT:  ACH file '+ data.fileName +' with effective date '+ data.dated +' has been processed successfully.</p>';
        },
        alertACHImportNotProcessed: function(data){
            return '<p>ALERT:  ACH file '+ data.fileName +' with effective date '+ data.dated +' has been declined.</p>';
        },
        alertWireTransfer: function(data){
            return '<p>ALERT:  Wire transfer request for recipient '+ data.recipientName +' for amount $'+ data.amount +' scheduled for ' + data.dated + ' has been successfully processed.</p>';
        },
        changedFTL: function(data){
            return '<p>Dear '+ data.customerName+', </p>'+'<p>Your Internet Banking is activated with username <b>'+ data.userName +'</b> .</p><br/>';
        },
        changedPassword: function(data){
            return '<p>Dear '+ data.customerName+', </p>'+'<p>Your Login Password is changed. For security reasons we recommend you not to share your password with anyone including bank staff.</p><br/>';
        },
        customerOnboardingUserMail: function(data){
            return '<p>Dear '+ data.customerName+', </p>'+'<p>Your Login Username is <b>'+data.userName+'</b>. For security reasons we recommend you not to share your username with anyone including bank staff.</p><br/>';
        },
        customerOnboardingPasswordMail: function(data){
            return '<p>Dear '+ data.customerName+', </p>'+'<p>Your Login Password is <b>'+data.password+'</b>. For security reasons we recommend you not to share your password with anyone including bank staff.</p><br/>';
        }
    };

    module.exports = function(config , tnxId){
        return (new EmailTemplate(config , tnxId));
    };
})();