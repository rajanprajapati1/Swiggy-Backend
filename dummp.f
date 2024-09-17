
const accountSid = 'AC0aaa12025d5e1dd128bdfd785a0c0c1b' || 'VAebc6d1e948519fa59771b5e1e0f061c8';
const authToken = '0e50073617024ae97010094b521c53e2';
const client = new twilio(accountSid, authToken);
const RecoveryCode = '8E3LST43N4YWE11TRY8KQPCW';

app.post("/send-otp", async (req, res) => {
  const phoneNumber = '+918000817296' ;
  // const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // const otpEntry = new OTP({ phoneNumber, otp });
  // await otpEntry.save();

  client.messages
    .create({
      body: `Your OTP is 123456`,
      to: phoneNumber,
      from: "+917984139516",
    })
    .then((message) => res.status(200).json({msg  :"OTP sent successfully"}))
    .catch((error) => res.status(500).json({msg : "Failed to send OTP" ,error}));
});

// curl 'https://verify.twilio.com/v2/Services/VAebc6d1e948519fa59771b5e1e0f061c8/Verifications' -X POST \
// --data-urlencode 'To=+917984139516' \
// --data-urlencode 'Channel=sms' \
// -u AC0aaa12025d5e1dd128bdfd785a0c0c1b:[AuthToken]
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// Parse application/json

const otpSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 }, // expires after 5 minutes
});
const OTP = mongoose.model("OTP", otpSchema);