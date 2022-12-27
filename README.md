# tOtp_service_folder
<h1>V1.1.0</h1>

- Now Code as per the standards
- Code commenting done properly 
- No junk code
- No use of For loop
- Appropriate variables and function name
- Optimised Code

**Full Changelog**: https://github.com/iam-riyaz/tOtp_service_folder/commits/v1.10
##
**To setup Project in Local Mechine**
run in your terminal 

**1. npm install**

**2. npm start**
##

Full Route to **Createing OTP**: "http://localhost:2001/v1/otp/createOtp"


**request body:
{**

email:"abc@xyz.com",  //required 


phone:"9876054321"  //required 

**}**

##

Full Route to **Validate OTP**: "http://localhost:2001/v1/otp/validateOtp"

**request body:
{**

email:"abc@xyz.com",  //required 

timestamp:"124727487892727" //required 

otp:"987321"  //required 

**}**
