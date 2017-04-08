(function(){

    var moment = require('moment');

    var accountInquiry = require('../server/coreMethods/accountInquiryCore');

    var jsonTranCodes = {
        "tranCodes" : [
            {
                "category" : "ATM",
                "codes"	   : [
                    {"trancode" : "305" , "description" : "ATM Credit Adj"},
                    {"trancode" : "405" , "description" : "ATM Debit Adj"},
                    {"trancode" : "123" , "description" : "ATM Deposit"},
                    //{"trancode" : "2002" , "description" : "ATM Deposit"},
                    {"trancode" : "2003" , "description" : "ATM Deposit - Forced"},
                    {"trancode" : "2004" , "description" : "ATM Deposit - Reversal"},
                    {"trancode" : "287" , "description" : "ATM Deposit/Trf Rev"},
                    {"trancode" : "126" , "description" : "ATM Fee Reversal"},
                    {"trancode" : "301" , "description" : "ATM Foreign Credit"},
                    {"trancode" : "300" , "description" : "ATM Foreign Trf Cr"},
                    {"trancode" : "400" , "description" : "ATM Foreign Trf Dr"},
                    {"trancode" : "2017" , "description" : "ATM Funds transfer Credit"},
                    {"trancode" : "2018" , "description" : "ATM Funds transfer Credit - Forced"},
                    {"trancode" : "2014" , "description" : "ATM Funds transfer Debit"},
                    {"trancode" : "2015" , "description" : "ATM Funds transfer Debit - Forced"},
                    {"trancode" : "127" , "description" : "ATM Inquiry"},
                    {"trancode" : "255" , "description" : "ATM Inquiry Fee"},
                    {"trancode" : "407" , "description" : "ATM Int Trf Dep Rev"},
                    {"trancode" : "307" , "description" : "ATM Int Trf W/D Rev"},
                    {"trancode" : "306" , "description" : "ATM Internet Trf Dep"},
                    //{"trancode" : "408" , "description" : "ATM Internet Trf W/D"},
                    {"trancode" : "409" , "description" : "ATM Quasi Cash"},
                    {"trancode" : "230" , "description" : "ATM Transaction Fee"},
                    {"trancode" : "124" , "description" : "ATM Transfer Deposit"},
                    {"trancode" : "228" , "description" : "ATM Trf Withdrawal"},
                    {"trancode" : "186" , "description" : "ATM WD/Trf Reversal"},
                    {"trancode" : "2011" , "description" : "ATM Withdrawal"},
                    {"trancode" : "227" , "description" : "ATM Withdrawal"},
                    {"trancode" : "2012" , "description" : "ATM Withdrawal -  Forced"},
                    {"trancode" : "2013" , "description" : "ATM Withdrawal -  Reversal"},
                    //{"trancode" : "226" , "description" : "ATM/POS Inquiry"}
                ]
            },
            {
                "category" : "CASH",
                "codes"	   : [
                    { "trancode" : "2002","description" : "Cash" },
                ]
            },
            {
                "category" : "CHECK",
                "codes"	   : [
                    { "trancode" : "200" , "description" : "Cashed Check" },
                    { "trancode" : "128" , "description" : "0n Check Return" },
                    { "trancode" : "207" , "description" : "Check" },
                    { "trancode" : "103" , "description" : "Check Returned" },
                    { "trancode" : "102" , "description" : "Check Reversal" },
                    { "trancode" : "206" , "description" : "Pay First Check" }
                ]
            },
            {
                "category" : "CREDIT",
                "codes"	   : [
                    { "trancode" : "162","description" : "Ret Item Chrg Rev" },
                    { "trancode" : "165","description" : "Transfer Chrg  Rev" },
                    { "trancode" : "166","description" : "Dep Itm Rt Chrg Rev" },
                    { "trancode" : "168","description" : "Dormant Srv Chrg Rev" },
                    { "trancode" : "170","description" : "Sales Tax Reversal" },
                    { "trancode" : "171","description" : "Penalty Reversal" },
                    { "trancode" : "173","description" : "Fed Withholding Rev" },
                    { "trancode" : "174","description" : "St Withholding Rev" },
                    { "trancode" : "176","description" : "Earnings Ytd Cr Adj" },
                    { "trancode" : "177","description" : "Earnings LYR Cr Adj" },
                    { "trancode" : "178","description" : "Accrued Credit Adj" },
                    { "trancode" : "180","description" : "Fed Withhold Cr Adj" },
                    { "trancode" : "181","description" : "St Withhold Cr Adj" },
                    { "trancode" : "182","description" : "Fed Wthd LYR Cr Adj" },
                    { "trancode" : "183","description" : "St Wthd LYR Cr Adj" },
                    { "trancode" : "185","description" : "Penalty LYR Cr Adj" },
                    { "trancode" : "187","description" : "POS Debit Reversal" },
                    { "trancode" : "188","description" : "Wire Transfer Credit" },
                    { "trancode" : "190","description" : "Bill Pay Reversal" },
                    { "trancode" : "196","description" : "Distribution Rev" },
                    { "trancode" : "197","description" : "Lump Sum Distrib Rev" },
                    { "trancode" : "198","description" : "Closing Deposit" },
                    { "trancode" : "100","description" : "Opening Deposit" },
                    { "trancode" : "101","description" : "Deposit" },
                    { "trancode" : "108","description" : "Credit Adjustment" },
                    { "trancode" : "111","description" : "Accr Earning Pymt" },
                    { "trancode" : "115","description" : "IRA Penalty Reversal" },
                    { "trancode" : "116","description" : "Telephone Trf Dep" },
                    { "trancode" : "117","description" : "Transfer Deposit" },
                    { "trancode" : "120","description" : "Debit Card Credit" },
                    { "trancode" : "121","description" : "Earnings Tran Dep" },
                    { "trancode" : "350","description" : "Deposit correction" },
                    { "trancode" : "1","description" : "test" },
                    { "trancode" : "132","description" : "Miscellaneous Credit" },
                    { "trancode" : "232","description" : "Miscellaneous Credit" },
                    { "trancode" : "10001","description" : "testtrancode" },
                    { "trancode" : "45","description" : "Credit Adjustment" },
                    { "trancode" : "650","description" : "new postingparameter" },
                    { "trancode" : "1111","description" : "TEST" },
                    { "trancode" : "555","description" : "test" },
                    { "trancode" : "1005","description" : "Deposit, Type: 20" },
                    { "trancode" : "1006","description" : "Deposit, Type: 20 (Forced)" },
                    { "trancode" : "1010","description" : "Withdrawal, Type: 00 (Reversal)" },
                    { "trancode" : "1013","description" : "Withdrawal, Type: 01 (Reversal)" },
                    { "trancode" : "2005","description" : "Return" },
                    { "trancode" : "2006","description" : "Return - Forced" },
                    { "trancode" : "1002","description" : "Deposit, Type: 21" },
                    { "trancode" : "1003","description" : "Deposit, Type: 21 (Forced)" },
                    { "trancode" : "2010","description" : "Debit Goods and Services Reversal" },
                    { "trancode" : "1017","description" : "Transfer Credit" },
                    { "trancode" : "1018","description" : "Transfer Credit (Forced)" },
                    { "trancode" : "667","description" : "njgjg" },
                    { "trancode" : "788","description" : "jkj" },
                    { "trancode" : "78","description" : "gfgfdd" },
                    { "trancode" : "500","description" : "Test" },
                    { "trancode" : "678","description" : "Test ts" },
                    { "trancode" : "600","description" : "test sample" },
                    { "trancode" : "700","description" : "trancode new" },
                    { "trancode" : "2016","description" : "post withdraw" },
                    { "trancode" : "11111","description" : "test" },
                    { "trancode" : "175","description" : "Write Off" },
                    { "trancode" : "1952","description" : "MISC ESCROW DISBURSED AMOUNT" },
                    { "trancode" : "8840","description" : "Escrow Disbursement" },
                    { "trancode" : "8841","description" : "Life AH Disbursement" },
                    { "trancode" : "1957","description" : "GP Original Balance" },
                    { "trancode" : "1959","description" : "GP Current Balance" },
                    { "trancode" : "1960","description" : "GP Portion Principal" },
                    { "trancode" : "8843","description" : "Loan Renewal" },
                    { "trancode" : "1964","description" : "NA PRINCIPAL BALANCE" },
                    { "trancode" : "1986","description" : "Non Accrual Date " },
                    { "trancode" : "1967","description" : "NA NET" },
                    { "trancode" : "1981","description" : "Total Available Balance" },
                    { "trancode" : "1982","description" : "Term Loan Limit Used" },
                    { "trancode" : "1983","description" : "Unused Term Loan Limit" },
                    { "trancode" : "1984","description" : "Credit Line Limit Used" },
                    { "trancode" : "1985","description" : "Unused Credit Line Limit" },
                    { "trancode" : "1944","description" : "Unused Cr Line Amount" },
                    { "trancode" : "8051","description" : "Debit Adjust Bank Rebate" },
                    { "trancode" : "8901","description" : "Product Change" },
                    { "trancode" : "8902","description" : "Assigned Branch Change" },
                    { "trancode" : "8903","description" : "Assigned Bank Change" },
                    { "trancode" : "8842","description" : "Loan Extension" },
                    { "trancode" : "1946","description" : "Acc Health" },
                    { "trancode" : "1951","description" : "ESCROW DISBURSED AMOUNT" },
                    { "trancode" : "1910","description" : "Bank Rebate" },
                    { "trancode" : "1911","description" : "Colleteral Rebate" },
                    { "trancode" : "1912","description" : "Special Reserve1 Rebate" },
                    { "trancode" : "1913","description" : "Special Reserve2 Rebate" },
                    { "trancode" : "1914","description" : "Dealer Rebate" },
                    { "trancode" : "1915","description" : "Dealer Hold Back Rebate" },
                    { "trancode" : "1916","description" : "Original Loan Amount" },
                    { "trancode" : "1917","description" : "Amortized Balance" },
                    { "trancode" : "1918","description" : "Credit Life Rebate" },
                    { "trancode" : "1925","description" : "Past Due Amount" },
                    { "trancode" : "1926","description" : "Dealer Daily Accrual Amount" },
                    { "trancode" : "1932","description" : "Past Principal Due" },
                    { "trancode" : "1934","description" : "Past Escrow Due" },
                    { "trancode" : "1935","description" : "Past AH Life Due" },
                    { "trancode" : "99999","description" : "End Day" },
                    { "trancode" : "9991","description" : "Initial Fund" },
                    { "trancode" : "1901","description" : "Principal" },
                    { "trancode" : "1903","description" : "Escrow" },
                    { "trancode" : "1906","description" : "Credit Life-A/H" },
                    { "trancode" : "1908","description" : "Accidental Health Life" },
                    { "trancode" : "1909","description" : "UnApplied Fund" },
                    { "trancode" : "1940","description" : "BANK DISCOUNT" },
                    { "trancode" : "1943","description" : "Cr Line Drawn Amount" },
                    { "trancode" : "129","description" : "Internet Transfer Deposit" },
                    { "trancode" : "130","description" : "Internet ACH Credit" },
                    { "trancode" : "131","description" : "Contribution" },
                    { "trancode" : "133","description" : "Employer Contr" },
                    { "trancode" : "134","description" : "Rechar Contr" },
                    { "trancode" : "135","description" : "Prior Year Contrib" },
                    { "trancode" : "136","description" : "Rollover Credit" },
                    { "trancode" : "137","description" : "Write Off Close" },
                    { "trancode" : "138","description" : "W/O Recovery Close" },
                    { "trancode" : "139","description" : "Transfer Credit" },
                    { "trancode" : "140","description" : "IntraIRA Credit" },
                    { "trancode" : "141","description" : "Emplyr Pr Yr Contr" },
                    { "trancode" : "142","description" : "Roth Conversion" },
                    { "trancode" : "143","description" : "Basis Credit" },
                    { "trancode" : "148","description" : "HRA/FSA Rollover" },
                    { "trancode" : "155","description" : "Bill Pay Offset" },
                    { "trancode" : "160","description" : "Overdraft Chrg Rev" }
                ]
            },
            {
                "category" : "DEBIT",
                "codes"	   : [
                    //{ "trancode" : "450","description" : "Deposit correction" },
                    { "trancode" : "428","description" : "Research per hr" },
                    { "trancode" : "427","description" : "Research per page" },
                    { "trancode" : "415","description" : "Outgoing Wires" },
                    { "trancode" : "403","description" : "Pinless Debit" },
                    { "trancode" : "256","description" : "Christmas club withdrawal" },
                    { "trancode" : "1852","description" : "MISC_ESCROW DISBURSED AMOUNT" },
                    { "trancode" : "9941","description" : "Life AH Disbursement" },
                    { "trancode" : "1840","description" : "BANK DISCOUNT" },
                    { "trancode" : "1857","description" : "GP Original Balance" },
                    { "trancode" : "1859","description" : "GP Current Balance" },
                    { "trancode" : "1860","description" : "GP Portion Principal" },
                    { "trancode" : "1864","description" : "NA PRINCIPAL BALANCE" },
                    { "trancode" : "1886","description" : "Non Accrual Date " },
                    { "trancode" : "432","description" : "Wire Transfer Debit" },
                    { "trancode" : "1867","description" : "NA NET" },
                    { "trancode" : "8873","description" : "NA Advance" },
                    { "trancode" : "8875","description" : "CO Advance" },
                    { "trancode" : "1881","description" : "Total Available Balance" },
                    { "trancode" : "1882","description" : "Term Loan Limit Used" },
                    { "trancode" : "1883","description" : "Unused Term Loan Limit" },
                    { "trancode" : "1884","description" : "Credit Line Limit Used" },
                    { "trancode" : "1885","description" : "Unused Credit Line Limit" },
                    { "trancode" : "1844","description" : "Unused Cr Line Amount" },
                    { "trancode" : "8805","description" : "Advance" },
                    { "trancode" : "8061","description" : "Credit Adjust Bank Rebate" },
                    { "trancode" : "1846","description" : "Acc Health" },
                    { "trancode" : "1851","description" : "ESCROW DISBURSED AMOUNT" },
                    { "trancode" : "1810","description" : "Bank Rebate" },
                    { "trancode" : "1811","description" : "Colleteral Rebate" },
                    { "trancode" : "1812","description" : "Special Reserve1 Rebate" },
                    { "trancode" : "1813","description" : "Special Reserve2 Rebate" },
                    { "trancode" : "1814","description" : "Dealer Rebate" },
                    { "trancode" : "1815","description" : "Dealer Hold Back Rebate" },
                    { "trancode" : "1816","description" : "Original Loan Amount" },
                    { "trancode" : "1817","description" : "Amortized Balance" },
                    { "trancode" : "1818","description" : "Credit Life Rebate" },
                    { "trancode" : "1825","description" : "Past Due Amount" },
                    { "trancode" : "1826","description" : "Dealer Daily Accrual Amount" },
                    { "trancode" : "1832","description" : "Past Principal Due" },
                    { "trancode" : "1834","description" : "Past Escrow Due" },
                    { "trancode" : "1835","description" : "Past AH Life Due" },
                    { "trancode" : "88888","description" : "End Day" },
                    { "trancode" : "8881","description" : "Initial Fund" },
                    { "trancode" : "1801","description" : "Principal" },
                    { "trancode" : "1803","description" : "Escrow" },
                    { "trancode" : "1806","description" : "Credit Life-A/H" },
                    { "trancode" : "1808","description" : "Accidental Health Life" },
                    { "trancode" : "1809","description" : "UnApplied Fund" },
                    { "trancode" : "1843","description" : "Cr Line Drawn Amount" },
                    { "trancode" : "149","description" : "Excess Contr Earn Rv" },
                    { "trancode" : "201","description" : "Withdrawal" },
                    { "trancode" : "202","description" : "Deposit Reversal" },
                    { "trancode" : "203","description" : "Deposit Item Ret" },
                    { "trancode" : "205","description" : "Force Pay Debit" },
                    { "trancode" : "208","description" : "Debit Adjustment" },
                    { "trancode" : "210","description" : "Earnings Paymt Rev" },
                    { "trancode" : "211","description" : "Accr Earning Pmt Rev" },
                    { "trancode" : "212","description" : "Earn Pymt To Rev" },
                    { "trancode" : "215","description" : "IRA Penalty" },
                    { "trancode" : "216","description" : "Telephone Trf W/D" },
                    { "trancode" : "217","description" : "Transfer Withdrawal" },
                    { "trancode" : "219","description" : "Auto Loan Pmt Retry" },
                    { "trancode" : "220","description" : "Automatic Loan Pmt" },
                    { "trancode" : "222","description" : "Safe Deposit Box Pmt" },
                    { "trancode" : "224","description" : "MMDA Withdrawal" },
                    { "trancode" : "229","description" : "Debit Card PIN" },
                    { "trancode" : "231","description" : "Contribution Rev" },
                    { "trancode" : "233","description" : "Emplyr Contr Rev" },
                    { "trancode" : "234","description" : "Rechar Contr Rev" },
                    { "trancode" : "235","description" : "Pr Yr Contrib Rev" },
                    { "trancode" : "236","description" : "Rollover Credit Rev" },
                    { "trancode" : "239","description" : "Transfer Debit" },
                    { "trancode" : "240","description" : "IntraIRA Debit" },
                    { "trancode" : "241","description" : "Empr Pr Yr Contr Rev" },
                    { "trancode" : "242","description" : "Roth Conversion Rev" },
                    { "trancode" : "243","description" : "Basis Debit" },
                    { "trancode" : "248","description" : "HRA/FSA Rollover Rev" },
                    { "trancode" : "249","description" : "Excess Contr Earn Dr" },
                    { "trancode" : "257","description" : "Debit Card Signature" },
                    { "trancode" : "262","description" : "Return Item Chrg" },
                    { "trancode" : "266","description" : "Dep Item Ret Chrg" },
                    { "trancode" : "268","description" : "Dormant Service Chrg" },
                    { "trancode" : "270","description" : "Sales Tax" },
                    { "trancode" : "271","description" : "Penalty" },
                    { "trancode" : "273","description" : "Federal Withhold" },
                    { "trancode" : "274","description" : "State Withholding" },
                    { "trancode" : "275","description" : "Prtl WD Pen Fr Bal" },
                    { "trancode" : "276","description" : "Earnings YTD Dr Adj" },
                    { "trancode" : "277","description" : "Earnings LYR Dr Adj" },
                    { "trancode" : "278","description" : "Accrued Debit Adj" },
                    { "trancode" : "280","description" : "Fed Withhold Dr Adj" },
                    { "trancode" : "281","description" : "St Withhold Dr Adj" },
                    { "trancode" : "282","description" : "Fed Wthd LYR Dr Adj" },
                    { "trancode" : "283","description" : "St Wthd LYR Dr Adj" },
                    { "trancode" : "285","description" : "Penalty LYR Dr Adj" },
                    { "trancode" : "288","description" : "POS Credit Reversal" },
                    { "trancode" : "289","description" : "Internet Transfer W/D" },
                    { "trancode" : "290","description" : "Bill Pay Withdrawal" },
                    { "trancode" : "292","description" : "Internet ACH Debit" },
                    { "trancode" : "296","description" : "Distribution" },
                    { "trancode" : "297","description" : "Lump Sum Distrib" },
                    { "trancode" : "298","description" : "Closing Withdrawal" },
                    { "trancode" : "299","description" : "Auto Close Withdrl" },
                    { "trancode" : "456","description" : "ledger test1" },
                    { "trancode" : "151","description" : "Miscellaneous Debit" },
                    { "trancode" : "251","description" : "Miscellaneous Debit " },
                    { "trancode" : "10002","description" : "testmemo" },
                    { "trancode" : "1011","description" : "Withdrawal, Type: 01" },
                    { "trancode" : "1012","description" : "Withdrawal, Type: 01 (Forced)" },
                    { "trancode" : "1008","description" : "Withdrawal, Type: 00" },
                    { "trancode" : "1009","description" : "Withdrawal, Type: 00 (Forced)" },
                    { "trancode" : "1004","description" : "Deposit, Type: 21 (Reversal)" },
                    { "trancode" : "1007","description" : "Deposit, Type: 20 (Reversal)" },
                    { "trancode" : "2007","description" : "Return - Reversal" },
                    { "trancode" : "2008","description" : "Debit Goods and Services" },
                    { "trancode" : "2009","description" : "Debit Goods and Services - Forced" },
                    { "trancode" : "1015","description" : "Transfer Debit (Forced)" },
                    { "trancode" : "1014","description" : "Transfer Debit" }
                ]
            },
            {
                "category" : "DEP",
                "codes"	   : [
                    { "trancode" : "450","description" : "Deposit correction" }
                ]
            },
            {
                "category" : "DIRECTDEBIT",
                "codes"	   : [
                    { "trancode" : "462","description" : "462_ACH_Memo_Debit" },
                    { "trancode" : "562","description" : "562_ACH_Ledger_Debit" },
                    { "trancode" : "221","description" : "ACH Deposit Reversal" },
                    { "trancode" : "431","description" : "ACH Prenote" }
                ]
            },
            {
                "category" : "DIRECTDEP",
                "codes"	   : [
                    { "trancode" : "4101","description" : "4101_SDB_Ledger_AutoTransfer_Credit" },
                    { "trancode" : "416","description" : "416_ACH_Memo_Credit" },
                    { "trancode" : "516","description" : "516_ACH_Ledger_Credit" },
                    { "trancode" : "118","description" : "ACHDeposit" }
                ]
            },
            {
                "category" : "DIV",
                "codes"	   : [
                ]
            },
            {
                "category" : "FEE",
                "codes"	   : [
                    { "trancode" : "291" , "description" : "Bill Pay Fee" },
                    { "trancode" : "410" , "description" : "Cashiers Check Fee" },
                    { "trancode" : "411" , "description" : "Collection Fee" },
                    { "trancode" : "8834" , "description" : "Credit Memo Other Fee Payment" },
                    { "trancode" : "2023" , "description" : "Cross Border Fee" },
                    { "trancode" : "2024" , "description" : "Cross Border Fee Forced" },
                    { "trancode" : "2025" , "description" : "Cross Border Fee Reversal" },
                    { "trancode" : "1023" , "description" : "Cross Border Fees" },
                    { "trancode" : "1024" , "description" : "Cross Border Fees (Forced)" },
                    { "trancode" : "1025" , "description" : "Cross Border Fees Reversal" },
                    { "trancode" : "2020" , "description" : "Currency Conversion Fees" },
                    { "trancode" : "1020" , "description" : "Currency Conversion Fees" },
                    { "trancode" : "2021" , "description" : "Currency Conversion Fees (Forced)" },
                    { "trancode" : "1021" , "description" : "Currency Conversion Fees (Forced)" },
                    { "trancode" : "2022" , "description" : "Currency Conversion Fees Reversal" },
                    { "trancode" : "1022" , "description" : "Currency Conversion Fees Reversal" },
                    { "trancode" : "1999" , "description" : "Debit Card Acquirer Convenience Fee" },
                    { "trancode" : "2000" , "description" : "Debit Card Acquirer Convenience Fee Forced" },
                    { "trancode" : "2001" , "description" : "Debit Card Acquirer Convenience Fee Reversal" },
                    { "trancode" : "999" , "description" : "Debit Card Fees" },
                    { "trancode" : "1000" , "description" : "Debit Card Fees (Forced)" },
                    { "trancode" : "1001" , "description" : "Debit Card Fees Reversal" },
                    { "trancode" : "8824" , "description" : "Debit Memo Other Fee Payment" },
                    { "trancode" : "1962" , "description" : "GP Portion Fee" },
                    { "trancode" : "1862" , "description" : "GP Portion Fee" },
                    { "trancode" : "272" , "description" : "IRA Fee" },
                    { "trancode" : "172" , "description" : "IRA Fee Reversal" },
                    { "trancode" : "433" , "description" : "Incoming Wire Fee" },
                    { "trancode" : "1956" , "description" : "Initialized Service Fee" },
                    { "trancode" : "1856" , "description" : "Initialized Service Fee" },
                    { "trancode" : "293" , "description" : "Internet ACH Fee" },
                    { "trancode" : "150" , "description" : "Misc Fee Reversal" },
                    { "trancode" : "1936" , "description" : "Origination Fee Paid" },
                    { "trancode" : "1836" , "description" : "Origination Fee Paid" },
                    { "trancode" : "8818" , "description" : "Originaton Fee Payment" },
                    { "trancode" : "1904" , "description" : "Other Fees" },
                    { "trancode" : "1804" , "description" : "Other Fees" },
                    { "trancode" : "434" , "description" : "Outgoing Wire Fee" },
                    { "trancode" : "1955" , "description" : "Remaining Service Fee" },
                    { "trancode" : "1855" , "description" : "Remaining Service Fee" },
                    { "trancode" : "1953" , "description" : "Service Fee" },
                    { "trancode" : "1853" , "description" : "Service Fee" },
                    { "trancode" : "8838" , "description" : "Service Fee - Credit Adjustment" },
                    { "trancode" : "8828" , "description" : "Service Fee - Debit Adjustment" },
                    { "trancode" : "1954" , "description" : "Service Fee Net" },
                    { "trancode" : "1854" , "description" : "Service Fee Net" },
                    { "trancode" : "1950" , "description" : "Servicing Fee" },
                    { "trancode" : "1850" , "description" : "Servicing Fee" },
                    { "trancode" : "258" , "description" : "phone bank fax fee" },
                    { "trancode" : "259" , "description" : "phone bank trans fee" }
                ]
            },
            {
                "category" : "INT",
                "codes"	   : [
                    { "trancode" : "1922" , "description" : "Accrued Interest" },
                    { "trancode" : "1822" , "description" : "Accrued Interest" },
                    { "trancode" : "1923" , "description" : "Accrued Interest Net" },
                    { "trancode" : "1823" , "description" : "Accrued Interest Net" },
                    { "trancode" : "1924" , "description" : "Accumulated Interest" },
                    { "trancode" : "1824" , "description" : "Accumulated Interest" },
                    { "trancode" : "1969" , "description" : "CHARGE OFF INTEREST" },
                    { "trancode" : "1869" , "description" : "CHARGE OFF INTEREST" },
                    { "trancode" : "1970" , "description" : "CHARGE OFF INTEREST PAID" },
                    { "trancode" : "1870" , "description" : "CHARGE OFF INTEREST PAID" },
                    { "trancode" : "8876" , "description" : "CO Interest Adjustment" },
                    { "trancode" : "1928" , "description" : "Dealer Accrued Interest" },
                    { "trancode" : "1828" , "description" : "Dealer Accrued Interest" },
                    { "trancode" : "1927" , "description" : "Dealer Accumulative Interest" },
                    { "trancode" : "1827" , "description" : "Dealer Accumulative Interest" },
                    { "trancode" : "1941" , "description" : "EXTENSION INTEREST ASSESSED" },
                    { "trancode" : "1841" , "description" : "EXTENSION INTEREST ASSESSED" },
                    { "trancode" : "1942" , "description" : "EXTENSION INTEREST PAID" },
                    { "trancode" : "1842" , "description" : "EXTENSION INTEREST PAID" },
                    { "trancode" : "1961" , "description" : "GP Portion Interest" },
                    { "trancode" : "1861" , "description" : "GP Portion Interest" },
                    { "trancode" : "1905" , "description" : "Interest" },
                    { "trancode" : "1805" , "description" : "Interest" },
                    { "trancode" : "8835" , "description" : "Interest Paid  -Credit Adjustment" },
                    { "trancode" : "8825" , "description" : "Interest Paid  -Debit Adjustment" },
                    { "trancode" : "9913" , "description" : "Interest Payment" },
                    { "trancode" : "8813" , "description" : "Interest Payment" },
                    { "trancode" : "1938" , "description" : "Intialize Accrued Interest" },
                    { "trancode" : "1838" , "description" : "Intialize Accrued Interest" },
                    { "trancode" : "1966" , "description" : "NA INTEREST PAID" },
                    { "trancode" : "1866" , "description" : "NA INTEREST PAID" },
                    { "trancode" : "8874" , "description" : "NA Interest Adjustment" },
                    { "trancode" : "1965" , "description" : "NA UNPAID INTEREST" },
                    { "trancode" : "1865" , "description" : "NA UNPAID INTEREST" },
                    { "trancode" : "1933" , "description" : "Past Interest Due" },
                    { "trancode" : "1833" , "description" : "Past Interest Due" },
                    { "trancode" : "1948" , "description" : "Payoff Accured Interest" },
                    { "trancode" : "1848" , "description" : "Payoff Accured Interest" },
                    { "trancode" : "1949" , "description" : "Payoff Accured Interest Net" },
                    { "trancode" : "1849" , "description" : "Payoff Accured Interest Net" },
                    { "trancode" : "1939" , "description" : "Remaining Accrued Interest" },
                    { "trancode" : "1839" , "description" : "Remaining Accrued Interest" }
                ]
            },
            {
                "category" : "OTHER",
                "codes"	   : [
                ]
            },
            {
                "category" : "PAYMENT",
                "codes"	   : [
                    { "trancode" : "1945" , "description" : "ACCM SHORT PAYMENT" },
                    { "trancode" : "1845" , "description" : "ACCM SHORT PAYMENT" },
                    { "trancode" : "218" , "description" : "ACH Payment" },
                    { "trancode" : "119" , "description" : "ACH Payment Reversal" },
                    { "trancode" : "184" , "description" : "Analysis Payment" },
                    { "trancode" : "284" , "description" : "Analysis Payment Rev" },
                    { "trancode" : "8833" , "description" : "Credit Memo Escrow Payment" },
                    { "trancode" : "8836" , "description" : "Credit Memo LifeAH Payment" },
                    { "trancode" : "8831" , "description" : "Credit Memo Principal Payment" },
                    { "trancode" : "9994" , "description" : "Curtailment Non True Payment" },
                    { "trancode" : "8884" , "description" : "Curtailment Non True Payment" },
                    { "trancode" : "9920" , "description" : "Curtailment True Payment" },
                    { "trancode" : "8820" , "description" : "Curtailment True Payment" },
                    { "trancode" : "8823" , "description" : "Debit Memo Escrow Payment" },
                    { "trancode" : "8826" , "description" : "Debit Memo LifeAH Payment" },
                    { "trancode" : "8821" , "description" : "Debit Memo Principal Payment" },
                    { "trancode" : "110" , "description" : "Earnings Payment" },
                    { "trancode" : "112" , "description" : "Earnings Payment To" },
                    { "trancode" : "9914" , "description" : "Escrow Payment" },
                    { "trancode" : "8814" , "description" : "Escrow Payment" },
                    { "trancode" : "8112" , "description" : "Future Payment" },
                    { "trancode" : "9112" , "description" : "Future Payment-Reversal" },
                    { "trancode" : "1963" , "description" : "GP Portion Payment" },
                    { "trancode" : "1863" , "description" : "GP Portion Payment" },
                    { "trancode" : "9917" , "description" : "Life AH Payment" },
                    { "trancode" : "8817" , "description" : "Life AH Payment" },
                    { "trancode" : "9993" , "description" : "Loan Payoff" },
                    { "trancode" : "8883" , "description" : "Loan Payoff" },
                    { "trancode" : "1931" , "description" : "New Schedule Payment Amount" },
                    { "trancode" : "1831" , "description" : "New Schedule Payment Amount" },
                    { "trancode" : "125" , "description" : "POS Payment Reversal" },
                    { "trancode" : "9992" , "description" : "Regular Payment" },
                    { "trancode" : "8882" , "description" : "Regular Payment" },
                    { "trancode" : "8111" , "description" : "Regular Payment Auto Transfer" },
                    { "trancode" : "1929" , "description" : "Schedule Payment Amount" },
                    { "trancode" : "1829" , "description" : "Schedule Payment Amount" },
                    { "trancode" : "1988" , "description" : "Total Payments Recieved" },
                    { "trancode" : "1888" , "description" : "Total Payments Recieved" }
                ]
            },
            {
                "category" : "POS",
                "codes"	   : [
                    {"trancode" : "226" , "description" : "ATM/POS Inquiry"}
                ]
            },
            {
                "category" : "REPEATPMT",
                "codes"	   : [
                ]
            },
            {
                "category" : "SRVCHG",
                "codes"	   : [
                    { "trancode" : "261" , "description" : "Analysis Charge" },
                    { "trancode" : "161" , "description" : "Analysis Charge Reversal" },
                    { "trancode" : "1971" , "description" : "CHARGE OFF NET" },
                    { "trancode" : "1871" , "description" : "CHARGE OFF NET" },
                    { "trancode" : "1968" , "description" : "CHARGE OFF PRINCIPAL" },
                    { "trancode" : "1868" , "description" : "CHARGE OFF PRINCIPAL" },
                    { "trancode" : "1987" , "description" : "ChargeOff Date" },
                    { "trancode" : "1887" , "description" : "ChargeOff Date" },
                    { "trancode" : "1902" , "description" : "Collected Late Charge" },
                    { "trancode" : "1802" , "description" : "Collected Late Charge" },
                    { "trancode" : "8832" , "description" : "Credit Memo Late Charge Payment" },
                    { "trancode" : "8822" , "description" : "Debit Memo Late Charge Payment" },
                    { "trancode" : "286" , "description" : "Inquiry Charge" },
                    { "trancode" : "9916" , "description" : "Late Charge Payment" },
                    { "trancode" : "8816" , "description" : "Late Charge Payment" },
                    { "trancode" : "8837" , "description" : "Late Charge Waive off" },
                    { "trancode" : "9937" , "description" : "Late Charge Waive off" },
                    { "trancode" : "260" , "description" : "Overdraft charge" },
                    { "trancode" : "267" , "description" : "Service Charge" },
                    { "trancode" : "167" , "description" : "Service Charge Rev" },
                    { "trancode" : "223" , "description" : "Stop Pmt Charge" },
                    { "trancode" : "122" , "description" : "Stop Pmt Charge Rev" },
                    { "trancode" : "265" , "description" : "Transfer Charge" },
                    { "trancode" : "1907" , "description" : "Un Collected Late Charge" },
                    { "trancode" : "1807" , "description" : "Un Collected Late Charge" },
                    { "trancode" : "1919" , "description" : "Waived Late Charge" },
                    { "trancode" : "1819" , "description" : "Waived Late Charge" }
                ]
            },
            {
                "category" : "XFER",
                "codes"	   : [
                    {"trancode" : "408" , "description" : "ATM Internet Trf W/D"}
                ]
            }
        ]
    };

    function getCategoryFromTrancode(trancode){

        for(i=0; i<jsonTranCodes.tranCodes.length; i++){
            var codes = jsonTranCodes.tranCodes[i].codes;

            for(j=0;j<codes.length;j++){
                //console.log(" SOURCE : " + trancode + "   --- COMPARE TO : "+codes[j].trancode+ " -- " + jsonTranCodes.tranCodes[i].category);
                if ( String(codes[j].trancode) == String(trancode)){

                    //console.log(trancode+"<---------");

                    return jsonTranCodes.tranCodes[i].category;
                }
            }
        }

        return 'UNKNOWN';
    }

    function Quicken(config , userId, tnxId){
        this.config = config;
        this.tnxId = tnxId;
        this.userId = userId;
        this.dated = new Date();
        this.timezone='';
        this.timediff = this.dated.getTimezoneOffset();
        this.timediff_mins = (Math.abs(this.dated.getTimezoneOffset())%60);
        this.timediff_hrs = ((Math.abs(this.dated.getTimezoneOffset())-this.timediff_mins)/60);

        //if (this.timediff_mins<10)
        //    this.timediff_mins='0'+this.timediff_mins;

        this.timezone = "";

        //(this.timediff<0){
        //this.dated.setMinutes(this.dated.getMinutes()+parseInt(this.timediff_mins));
        if(this.timediff<0){
            this.dated = (moment().subtract(Math.abs(parseInt(this.timediff)),'minutes')).toDate();
        }else{
            this.dated = (moment().add((parseInt(this.timediff)),'minutes')).toDate();
        }
        //}


        /*if(this.timediff<0)
         this.timezone = this.timediff_mins+'.000['+Math.abs(this.timediff_hrs)+':GMT]';
         else
         this.timezone = this.timediff_mins+'.000[-'+this.timediff_hrs+':GMT]';
         */
    }

    Quicken.prototype = {
        forAllStatement: function(transactionData, callback){

            this.transactionData = transactionData;
            this.callback = callback;
            var routed = {
                accountNo               : transactionData[0].accountNo,
                accountCategory         : transactionData[0].accountCategory
            };
            var inquiry = accountInquiry.AccountInquiry(routed , this.config , this.tnxId);
            var resHandle = this.coreAccountHistory.bind(this);
            inquiry.coreCaller(resHandle);
        },
        coreAccountHistory: function(err , result){
            var customerId = '';
            var accountNo = '';
            var productTypeName = '';
            var accountType = '';
            var ledgerBal = '';
            var availBal = '';
            if(result){
                customerId = this.userId;//result.accountSummaryData.primaryAccountOwner.customer.customerId;
                accountNo= result.accountSummaryData.accountNo;

                productTypeName = result.accountSummaryData.productTypeName;
                accountType= result.accountSummaryData.accountType;

                if(productTypeName!=undefined||productTypeName!=null){
                    if(productTypeName.toUpperCase().trim().indexOf('MONEY') > 0 &&
                        productTypeName.toUpperCase().trim().indexOf('MARKET') > 0) {
                        accountType = 'MONEYMRKT';
                    }
                }

                ledgerBal = result.accountSummaryData.availableBalance.amount;
                availBal = result.accountSummaryData.availableBalance.amount;
            }
            this.ofxString = 'OFXHEADER:100\r\n'+
                'DATA:OFXSGML\r\n'+
                'VERSION:102\r\n'+
                'SECURITY:NONE\r\n'+
                'ENCODING:USASCII\r\n'+
                'CHARSET:1252\r\n'+
                'COMPRESSION:NONE\r\n'+
                'OLDFILEUID:NONE\r\n'+
                'NEWFILEUID:NONE\r\n'+
                '\r\n'+
                '<OFX>'+
                '<SIGNONMSGSRSV1>'+
                '<SONRS>'+
                '<STATUS>'+
                '<CODE>0'+
                '<SEVERITY>INFO'+
                '</STATUS>'+
                '<DTSERVER>'+ moment(this.dated).format('YYYYMMDDHHmmss')+this.timezone+'</DTSERVER>'+
                '<LANGUAGE>ENG'+
                '<FI>'+
                '<ORG>'+this.config.intuitConfig.ORG+
                '<FID>'+this.config.intuitConfig.FID+
                '</FI>'+
                '<INTU.BID>'+this.config.intuitConfig.BID+
                '<INTU.USERID>'+customerId+
                '</SONRS>'+
                '</SIGNONMSGSRSV1>'+
                '<BANKMSGSRSV1>'+
                '<STMTTRNRS>'+
                '<TRNUID>0'+
                '<STATUS>'+
                '<CODE>0'+
                '<SEVERITY>INFO'+
                '</STATUS>'+
                '<STMTRS>'+
                '<CURDEF>USD'+
                '<BANKACCTFROM>'+
                '<BANKID>'+this.config.intuitConfig.BANKID+
                '<ACCTID>'+accountNo+
                '<ACCTTYPE>'+accountType+
                '</BANKACCTFROM>'+
                '<BANKTRANLIST><DTSTART>'+moment(this.transactionData[0].fromDate).format('YYYYMMDDHHmmss')+this.timezone+'</DTSTART>'+
                '<DTEND>'+moment(this.transactionData[0].toDate).format('YYYYMMDDHHmmss')+this.timezone+'</DTEND>';

            this.FTID = 0;
            for(var i = 0; i < this.transactionData.length; i++){
                var statement = this.addStatement(this.transactionData[i]);
                this.ofxString = this.ofxString + statement;
            }

            var tailStr = '</BANKTRANLIST><LEDGERBAL>'+
                '<BALAMT>'+ledgerBal+'</BALAMT>'+
                '<DTASOF>' + moment(this.dated).format('YYYYMMDDHHmmss')+this.timezone+'</DTASOF>'+
                '</LEDGERBAL>'+
                '<AVAILBAL>'+
                '<BALAMT>'+availBal+'</BALAMT>'+
                '<DTASOF>'+ moment(this.dated).format('YYYYMMDDHHmmss')+this.timezone+'</DTASOF>'+
                '</AVAILBAL>'+
                '</STMTRS>'+
                '</STMTTRNRS>'+
                '</BANKMSGSRSV1>'+
                '</OFX>';

            this.ofxString = this.ofxString + tailStr;

            this.callback(this.ofxString);
        },
        addStatement: function(statementData){

            if(statementData.posted == this.postedDated){
                this.FTID = this.FTID + 1;
            }else{
                this.FTID = 0;
            }
            //console.log(statementData);
            var trntype = getCategoryFromTrancode(statementData.transcode);


            /* Some conditions to check as same trancode is used sometimes for both credit and debit transactions */
            if(trntype=='DIRECTDEBIT' && statementData.debitOrCredit=='CREDIT'){
                trntype='DIRECTDEP';
            }
            if(trntype=='DIRECTDEP' && statementData.debitOrCredit=='DEBIT'){
                trntype='DIRECTDEBIT';
            }
            if(trntype=='CREDIT' && statementData.debitOrCredit=='DEBIT'){
                trntype='DEBIT';
            }
            if(trntype=='DEBIT' && statementData.debitOrCredit=='CREDIT'){
                trntype='CREDIT';
            }
            /* End of conditions for trancodes */

            //console.log("TRANCODE : "+statementData.transcode+"    TRNTYPE : "+trntype+ "  DEBITORCREDIT: " +statementData.debitOrCredit);
            var lengthCheck = this.checkLength.bind(this);
            var stmtTransAmt = statementData.transactionAmt;
            if(trntype=='CHECK' && parseFloat(stmtTransAmt)>0)
                stmtTransAmt = stmtTransAmt * -1;

            var desc = (statementData.reference ? (statementData.reference + ":") : " ") + statementData.description;
            if(desc!=undefined && desc.length>32)
                desc = desc.substring(0,32);
            if(desc.length==0)
                desc = 'NA';

            var trancStr = '<STMTTRN>'+
                '<TRNTYPE>'+ (trntype=='UNKNOWN'?statementData.debitOrCredit:trntype) + '</TRNTYPE>' +
                '<DTPOSTED>'+ moment(statementData.posted).format('YYYYMMDDHHmmss')+this.timezone+'</DTPOSTED>' +
                '<TRNAMT>'+ stmtTransAmt + '</TRNAMT>' +
                '<FITID>'+ moment(statementData.posted).format('YYYYMMDDHHmmss')+this.timezone+ lengthCheck(this.FTID) + '</FITID>';
            if(statementData.check) {
                trancStr += '<CHECKNUM>' + statementData.check + '</CHECKNUM>';
            }
            trancStr += '<NAME>'+ desc + '</NAME>';
            //if(statementData.check != '') trancStr = trancStr + '<CHECKNUM>' + statementData.check;
            trancStr = trancStr + '</STMTTRN>';
            this.postedDated = statementData.posted;
            return trancStr;
        },
        checkLength: function(str){
            var fTidStr = JSON.stringify(str);
            for(var i = fTidStr.length; i< 6; i++){
                fTidStr = '0' + fTidStr;
            }

            return fTidStr;
        }
    };

    module.exports = function(config , userId, tnxId){
        return (new Quicken(config , userId, tnxId));
    };
})();