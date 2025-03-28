// In App in a new project

import React, {useState} from 'react';
import {View, Text, Image, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Button, Input, CheckBox} from '@rneui/themed';
import { encrypt, decrypt, compare } from 'n-krypta';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import Styles from '../../styles/css';
function TermNcondition({navigation, route}) {
  const {password, name, email} = route.params;

  const [check1, setCheck1] = useState(false);
  function ConvertStringToHex(str) {
		var arr = [];
		for (var i = 0; i < str.length; i++) {
		  arr[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
		}
		return "\\u" + arr.join("\\u");
	}

	function decryptData(str) {
		const CryptoJS = require("crypto-js");
		const key = ConvertStringToHex("Sourceable");
	
		const decrypted = CryptoJS.AES.decrypt(str, key);
		console.log(decrypted);
	
		console.log(
		  "-----------------------------------------------------------------------"
		);
		var output = decrypted.toString(CryptoJS.enc.Utf8);
		console.log(output);
	
		return output;
	}

function encryptedData(str){
    const key = ConvertStringToHex('Sourceable');
    const CryptoJS = require('crypto-js');
    const encryptedAudio = CryptoJS.AES.encrypt(str, key);

    return encryptedAudio;
  }

  function encryptID(message){
    const key = ConvertStringToHex('Sourceable');

    const encryptedString = encrypt(message, key); // #Iblankartan!not!svreblankartwhfreblankartzpublankartase!gettiogblankartypvrblankartiofprmatipn,blankartcvtblankartgpoeblankarttopid.blankartI!oeedtblankartuoblankartspeodblankartspneblankarttjmfblankartlearoing!nore!osblankartundesstaoeing!mpre.blankartTiankt!for!eycelleotblankartiogoblankartI!wbsblankartlooling!gorblankartuhjsblankartinfpblankartfos!myblankartnitsion.#

    return encryptedString;
 
  };

	function decryptID(message){
		const key = ConvertStringToHex('Sourceable');
	
		const encryptedString = decrypt(message, key); // #Iblankartan!not!svreblankartwhfreblankartzpublankartase!gettiogblankartypvrblankartiofprmatipn,blankartcvtblankartgpoeblankarttopid.blankartI!oeedtblankartuoblankartspeodblankartspneblankarttjmfblankartlearoing!nore!osblankartundesstaoeing!mpre.blankartTiankt!for!eycelleotblankartiogoblankartI!wbsblankartlooling!gorblankartuhjsblankartinfpblankartfos!myblankartnitsion.#
	
		return encryptedString;
	 
	};


  const register = async () => {

    // console.log(email,"-----------------------------",encryptedData(email).toString())
    await auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async res => {
        console.log('User account created & signed in!');
        await firestore()
          .collection('Accounts')
          .doc(encryptID(email))
          .set({
            email: encryptedData(email).toString(),
            name: encryptedData(name).toString(),
            account_type: encryptedData("mobile").toString(),
            status: encryptedData("online").toString(),
          })
          .then(() => {
            console.log('User added!');
            alert(
              'You have successfully signed up!',
            );
            navigation.navigate('Home');
          });
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          alert('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          alert('That email address is invalid!');
        }

        console.error(error);
      });
    console.log('user data', password, name, email);
  };
  return (
    <View style={Styles.container}>
      <View style={[Styles.authSubmit, {flex: 0.1}]}></View>

      <View style={[Styles.main, {flex: 0}]}>
        <View style={Styles.textWrapView}>
          <Text style={[Styles.titleOnboarding, Styles.singleFlex]}>
            Term & Condition
          </Text>
        </View>
      </View>

      <View style={Styles.main}>
        <View style={Styles.textWrapView}>
          <ScrollView>
            <Text style={[Styles.terms, Styles.singleFlex]}>
              These Terms and Conditions (hereinafter referred to as “T&Cs”)
              constitute a legally binding agreement between you (hereinafter
              referred to as the “User”) and Sourceable, regarding the User’s
              access to and use of Sourceable’s mobile application (hereinafter
              referred to as the “Application”).
            </Text>
            <Text style={[Styles.terms, Styles.singleFlex]}>
              The User agrees, that by accessing the application, they have
              read, understood, and agree to be bound by the T&Cs below:
            </Text>
            <Text
              style={[Styles.terms, Styles.singleFlex, {fontWeight: 'bold'}]}>
              USER REPRESENTATIONS
            </Text>
            <Text style={[Styles.terms, Styles.singleFlex]}>
              By using the Application, the User represents and warrants that:
              (1) all registration information the User submits will be true,
              accurate, current, and complete; (2) the User will maintain the
              accuracy of such information and promptly update such registration
              information as necessary; (3) the User has the legal capacity and
              the User agrees to comply with these T&Cs; (4) the User is not
              under the age of 18; (5) the User is not a minor in the
              jurisdiction in which the User resides; (6) the User will not
              access the Application through automated or non-human means,
              whether through a bot, script or otherwise; (7) the User will not
              use the Application for any illegal or unauthorized purpose; and
              (8) the User’s use of the Application will not violate any
              applicable law or regulation.
            </Text>
            <Text style={[Styles.terms, Styles.singleFlex]}>
              If the User provides any information that is untrue, inaccurate,
              not current, or incomplete, Sourceable retains the right to
              suspend or terminate the User’s account and refuse any and all
              current or future use of the Application.
            </Text>
            <Text
              style={[Styles.terms, Styles.singleFlex, {fontWeight: 'bold'}]}>
              PROHIBITED ACTIVITIES
            </Text>
            <Text style={[Styles.terms, Styles.singleFlex]}>
              The User may not access or use the Application for any purpose
              other than that for which Sourceable intends the Application to be
              available.
            </Text>

            <Text style={[Styles.terms, Styles.singleFlex]}>
              In using the Application, the User agrees to not:
            </Text>
            {/*  */}
            <Text style={[Styles.terms, Styles.singleFlex]}>
              {'\t\t\t'}1. Use any information obtained from the Application in
              order to harass, abuse, or harm another person.
              {'\n'}
              {'\t\t\t'}2. Use the Application to intentionally or knowingly
              spread misinformation or false information of any kind and in any
              manner.{'\n'}
              {'\t\t\t'}3. Misuse the Application for any illegal purpose.
              {'\n'}
              {'\t\t\t'}4. Make any unauthorized use of the Application,
              including collecting usernames and/or email addresses of users by
              electronic or other means for the purpose of sending unsolicited
              email, or creating user accounts by automated means or under false
              pretenses.
              {'\n'}
              {'\t\t\t'}5. Circumvent, disable, or otherwise interfere with
              security-related features of the Application, including features
              that prevent or restrict the use or copying of any Content or
              enforce limitations on the use of the Application and/or the
              Content contained therein.
              {'\n'}
              {'\t\t\t'}6. Trick, defraud, or mislead Sourceable and/or other
              users, especially in any attempt to learn sensitive account or
              user information;
              {'\n'}
              {'\t\t\t'}7. Make improper use of Sourceable’s support services or
              submit false reports of abuse or misconduct.
              {'\n'}
              {'\t\t\t'}8. Attempt to impersonate another user or person or use
              the username of another user.
              {'\n'}
              {'\t\t\t'}9. Sell or otherwise transfer the User’s profile.
            </Text>
            {/*  */}
            <Text
              style={[Styles.terms, Styles.singleFlex, {fontWeight: 'bold'}]}>
              USER GENERATED DATA AND CONTENT
            </Text>
            <Text style={[Styles.terms, Styles.singleFlex]}>
              Sourceable invites the User to use the Application to upload,
              post, and publish data and content, in line with Sourceable’s
              mission, including but not limited to, photographs, videos, and
              audio recordings. This Content may be viewable by other users of
              the Application, if User chooses to make the Content accessible to
              other users.
            </Text>
            <Text style={[Styles.terms, Styles.singleFlex]}>
              When the User posts or publishes Content, the User thereby
              represents and warrants the following:
            </Text>
            <Text style={[Styles.terms, Styles.singleFlex]}>
              {'\t\t\t'}1. The creation, distribution, transmission, public
              display, and the accessing, downloading, or copying of the User’s
              Content do not and will not infringe the proprietary rights,
              including but not limited to the copyright, patent, trademark,
              trade secret, or moral rights of any third party.
              {'\n'}
              {'\t\t\t'}2. The User is the creator and owner of or has the
              necessary licenses, rights, consents, releases, and permissions to
              use and to authorize the Application, and other users of the
              Application to use the User’s Content in the manners intended by
              the Application and these T&Cs.
              {'\n'}
              {'\t\t\t'}3. The User’s Content is not false, inaccurate, or
              misleading.
              {'\n'}
              {'\t\t\t'}4. The User’s Content is not obscene, lewd, lascivious,
              filthy, violent, harassing, libelous, slanderous, or otherwise
              objectionable (as determined by Sourceable)
              {'\n'}
              {'\t\t\t'}5. The User’s Content does not ridicule, mock,
              disparage, intimidate, or abuse anyone.
              {'\n'}
              {'\t\t\t'}6. The User’s Content does not contain any material that
              solicits personal information from anyone under the age of 18 or
              exploits people under the age of 18 in a sexual or violent manner.
              {'\n'}
              {'\t\t\t'}7. The User’s Content does not violate laws concerning
              child pornography, or otherwise intended to protect the health or
              well-being of minors;
            </Text>
            <Text style={[Styles.terms, Styles.singleFlex]}>
              Any use of the Application in violation of the foregoing violates
              these T&Cs and may result in, among other things, termination or
              suspension of the User’s rights to use the Application.
            </Text>
            <Text
              style={[Styles.terms, Styles.singleFlex, {fontWeight: 'bold'}]}>
              CONTRIBUTION LICENSE
            </Text>
            <Text style={[Styles.terms, Styles.singleFlex]}>
              By posting the User Content to any part of the Application, the
              User automatically grants, and the User represents and warrants
              that the User has the right to grant, to Sourceable an
              unrestricted, unlimited, irrevocable, perpetual, non-exclusive,
              transferable, royalty-free, fully-paid, worldwide right, and
              license to host, archive, store, and cache such Content
              (including, without limitation, the User’s image and voice).
            </Text>
            <Text style={[Styles.terms, Styles.singleFlex]}>
              Sourceable does not assert any ownership over the User Content.
              The User retain full ownership of all of the User Content and any
              intellectual property rights or other proprietary rights
              associated with the User Content. Sourceable is not liable for any
              statements or representations in the User Content provided by the
              User in any area on the Application. The User is solely
              responsible for the User Content to the Application and the User
              expressly agree to exonerate Sourceable from any and all
              responsibility and to refrain from any legal action against us
              regarding the User Content.
            </Text>
            <Text
              style={[Styles.terms, Styles.singleFlex, {fontWeight: 'bold'}]}>
              MOBILE APPLICATION LICENSE
            </Text>
            <Text
              style={[Styles.terms, Styles.singleFlex, {fontWeight: 'bold'}]}>
              {'\t\t\t'}Use License
            </Text>
            <Text style={[Styles.terms, Styles.singleFlex]}>
              If the User accesses the Application via a mobile application,
              then Sourceable grants the User a revocable, non-exclusive,
              non-transferable, limited right to install and use the mobile
              application on wireless electronic devices owned or controlled by
              the User, and to access and use the mobile application on such
              devices strictly in accordance with the terms and conditions of
              this mobile application license contained in these Terms of Use.
              The User shall not: (1) decompile, reverse engineer, disassemble,
              attempt to derive the source code of, or decrypt the application;
              (2) make any modification, adaptation, improvement, enhancement,
              translation, or derivative work from the application; (3) violate
              any applicable laws, rules, or regulations in connection with the
              User’s access or use of the application; (4) remove, alter, or
              obscure any proprietary notice (including any notice of copyright
              or trademark) posted by Sourceable or the licensors of the
              application; (5) use the application for any revenue generating
              endeavor, commercial enterprise, or other purpose for which it is
              not designed or intended; (6) make the application available over
              a network or other environment permitting access or use by
              multiple devices or users at the same time; (7) use the
              application for creating a product, service, or software that is,
              directly or indirectly, competitive with or in any way a
              substitute for the application; (8) use the application to send
              automated queries to any website or to send any unsolicited
              commercial e-mail; or (9) use any proprietary information or any
              of our interfaces or our other intellectual property in the
              design, development, manufacture, licensing, or distribution of
              any applications, accessories, or devices for use with the
              application.
            </Text>
            <Text
              style={[Styles.terms, Styles.singleFlex, {fontWeight: 'bold'}]}>
              {'\t\t\t'}Apple and Android Devices
            </Text>
            <Text style={[Styles.terms, Styles.singleFlex]}>
              The following terms apply when the User uses a mobile application
              obtained from either the Apple Store or Google Play (each an “App
              Distributor”) to access the Application: (1) the license granted
              to the User for Sourceable’s mobile application is limited to a
              non-transferable license to use the application on a device that
              utilizes the Apple iOS or Android operating systems, as
              applicable, and in accordance with the usage rules set forth in
              the applicable App Distributor’s terms of service; (2) Sourceable
              is responsible for providing any maintenance and support services
              with respect to the mobile application as specified in the terms
              and conditions of this mobile application license contained in
              these Terms of Use or as otherwise required under applicable law,
              and the User acknowledges that each App Distributor has no
              obligation whatsoever to furnish any maintenance and support
              services with respect to the mobile application; (3) in the event
              of any failure of the mobile application to conform to any
              applicable warranty, the User may notify the applicable App
              Distributor, and the App Distributor, in accordance with its terms
              and policies, may refund the purchase price, if any, paid for the
              mobile application, and to the maximum extent permitted by
              applicable law, the App Distributor will have no other warranty
              obligation whatsoever with respect to the mobile application; (4)
              the User acknowledges and agrees that the App Distributors are
              third-party beneficiaries of the terms and conditions in this
              mobile application license contained in these T&Cs, and that each
              App Distributor will have the right (and will be deemed to have
              accepted the right) to enforce the terms and conditions in this
              mobile application license contained in these T&Cs against the
              User as a third-party beneficiary thereof.
            </Text>
            <Text
              style={[Styles.terms, Styles.singleFlex, {fontWeight: 'bold'}]}>
              {'\t\t\t'}APP MANAGEMENT
            </Text>
            <Text style={[Styles.terms, Styles.singleFlex]}>
              Sourceable reservers the right, but not the obligation, to: (1)
              monitor the Application for violations of these T&Cs; (2) take
              appropriate legal action against anyone who, in Sourceable’s sole
              discretion, violates the law or these T&Cs, including without
              limitation, reporting such user to law enforcement authorities;
              (3) in Sourceable’s sole discretion and without limitation,
              refuse, restrict access to, limit the availability of, or disable
              (to the extent technologically feasible) any of the User’s
              Contentor any portion thereof; (4) in Sourceable’s sole discretion
              and without limitation, notice, or liability, to remove from the
              Application or otherwise disable all files and content that are
              excessive in size or are in any way burdensome to Sourceable’s
              systems; and (5) otherwise manage the Application in a manner
              designed to protect Sourceable’s rights and property and to
              facilitate the proper functioning of the Application.
            </Text>
            <Text
              style={[Styles.terms, Styles.singleFlex, {fontWeight: 'bold'}]}>
              {'\t\t\t'}APP MANAGEMENT
            </Text>
            <Text style={[Styles.terms, Styles.singleFlex]}>
              Sourceable reservers the right, but not the obligation, to: (1)
              monitor the Application for violations of these T&Cs; (2) take
              appropriate legal action against anyone who, in Sourceable’s sole
              discretion, violates the law or these T&Cs, including without
              limitation, reporting such user to law enforcement authorities;
              (3) in Sourceable’s sole discretion and without limitation,
              refuse, restrict access to, limit the availability of, or disable
              (to the extent technologically feasible) any of the User’s
              Contentor any portion thereof; (4) in Sourceable’s sole discretion
              and without limitation, notice, or liability, to remove from the
              Application or otherwise disable all files and content that are
              excessive in size or are in any way burdensome to Sourceable’s
              systems; and (5) otherwise manage the Application in a manner
              designed to protect Sourceable’s rights and property and to
              facilitate the proper functioning of the Application.
            </Text>
            <Text
              style={[Styles.terms, Styles.singleFlex, {fontWeight: 'bold'}]}>
              PRIVACY POLICY
            </Text>
            <Text style={[Styles.terms, Styles.singleFlex]}>
              By using the Application, the User agree to be bound by
              Sourceable’s Privacy Policy, which is incorporated into these
              T&Cs. Please be advised the Application is hosted in the United
              States. If the User access the Application from the European
              Union, Asia, or any other region of the world with laws or other
              requirements governing personal data collection, use, or
              disclosure that differ from applicable laws in the United States,
              then through the User’s continued use of the Application or
              Services, the User are transferring the User’s data to the United
              States, and the User expressly consents to have the User data
              transferred to and processed in the United States.{' '}
            </Text>
            <Text
              style={[Styles.terms, Styles.singleFlex, {fontWeight: 'bold'}]}>
              TERM AND TERMINATION
            </Text>
            <Text style={[Styles.terms, Styles.singleFlex]}>
              These T&Cs shall remain in full force and effect while the User
              uses the Application.{'\n\n'}
              If Sourceable terminates or suspend the User’s account for any
              reason, the User is prohibited from registering and creating a new
              account under the User’s name, a fake or borrowed name, or the
              name of any third party, even if the User may be acting on behalf
              of the third party. In addition to terminating or suspending the
              User’s account, Sourceable reserves the right to take appropriate
              legal action, including without limitation pursuing civil,
              criminal, and injunctive redress.
            </Text>
            <Text
              style={[Styles.terms, Styles.singleFlex, {fontWeight: 'bold'}]}>
              INTERRUPTIONS
            </Text>
            <Text style={[Styles.terms, Styles.singleFlex]}>
              Sourceable cannot guarantee the Application will be available at
              all times. Sourceable may experience hardware, software, or other
              problems or need to perform maintenance related to the
              Application, resulting in interruptions, delays, or errors.
              Sourceable reserves the right to change, revise, update, suspend,
              discontinue, or otherwise modify the Application at any time or
              for any reason without notice to the User. The User agrees that
              Sourceable has no liability whatsoever for any loss, damage, or
              inconvenience caused by the User’s inability to access or use the
              Application during any downtime or discontinuance of the
              Application. Nothing in these T&Cs will be construed to obligate
              Sourceable to maintain and support the Application or to supply
              any corrections, updates, or releases in connection therewith.
            </Text>
            <Text
              style={[Styles.terms, Styles.singleFlex, {fontWeight: 'bold'}]}>
              GOVERNING LAW
            </Text>
            <Text style={[Styles.terms, Styles.singleFlex]}>
              These Terms of Use and the User use of the Application are
              governed by and construed in accordance with the laws of the State
              of New York, applicable to agreements made and to be entirely
              performed within the State of New York without regard to its
              conflict of law principles.
            </Text>
            <Text
              style={[Styles.terms, Styles.singleFlex, {fontWeight: 'bold'}]}>
              DISCLAIMER
            </Text>
            <Text style={[Styles.terms, Styles.singleFlex]}>
              THE APPLICATION IS PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS.
              THE USER AGREES THAT USE OF THE APPLICATION SERVICES WILL BE AT
              THE USER’S SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW,
              SOURCEABLE DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, IN
              CONNECTION WITH THE APPLICATION AND THE USER’S USE THEREOF,
              INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF
              MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
              NON-INFRINGEMENT. SOURCEABLE WILL ASSUME NO LIABILITY OR
              RESPONSIBILITY FOR ANY (1) ERRORS, MISTAKES, OR INACCURACIES OF
              CONTENT AND MATERIALS, (2) PERSONAL INJURY OR PROPERTY DAMAGE, OF
              ANY NATURE WHATSOEVER, RESULTING FROM THE USER’S ACCESS TO AND USE
              OF THE APPLICATION, (3) ANY UNAUTHORIZED ACCESS TO OR USE OF
              SOURCEABLE’S SECURE SERVERS AND/OR ANY AND ALL PERSONAL
              INFORMATION AND/OR FINANCIAL INFORMATION STORED THEREIN, (4) ANY
              INTERRUPTION OR CESSATION OF TRANSMISSION TO OR FROM THE
              APPLICATION, (5) ANY BUGS, VIRUSES, TROJAN HORSES, OR THE LIKE
              WHICH MAY BE TRANSMITTED TO OR THROUGH THE APPLICATION BY ANY
              THIRD PARTY, AND/OR (6) ANY ERRORS OR OMISSIONS IN ANY CONTENT AND
              MATERIALS OR FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A
              RESULT OF THE USE OF ANY CONTENT POSTED, TRANSMITTED, OR OTHERWISE
              MADE AVAILABLE VIA THE APPLICATION.
            </Text>
            <Text
              style={[Styles.terms, Styles.singleFlex, {fontWeight: 'bold'}]}>
              INDEMNIFICATION
            </Text>
            <Text style={[Styles.terms, Styles.singleFlex]}>
              The User agrees to defend, indemnify, and hold Sourceable
              harmless, including Sourceable’s subsidiaries, affiliates, and all
              of Sourceable’s respective officers, agents, partners, and
              employees, from and against any loss, damage, liability, claim, or
              demand, including reasonable attorneys’ fees and expenses, made by
              any third party due to or arising out of: (1) the User’s Content;
              (2) use of the Site; (3) breach of these T&Cs; (4) any breach of
              the User’s representations and warranties set forth in these T&Cs;
              (5) the User’s violation of the rights of a third party, including
              but not limited to intellectual property rights; or (6) any overt
              harmful act toward any other user.
            </Text>
            <Text
              style={[Styles.terms, Styles.singleFlex, {fontWeight: 'bold'}]}>
              ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES
            </Text>
            <Text style={[Styles.terms, Styles.singleFlex]}>
              Visiting the Site, sending emails, and completing online forms
              constitute electronic communications. The User consents to receive
              electronic communications, and the User agrees that all
              agreements, notices, disclosures, and other communications
              Sourceable provides to the User electronically, via email and on
              the Site, satisfy any legal requirement that such communication be
              in writing. THE USER HEREBY AGREES TO THE USE OF ELECTRONIC
              SIGNATURES, CONTRACTS, ORDERS, AND OTHER RECORDS, AND TO
              ELECTRONIC DELIVERY OF NOTICES, POLICIES, AND RECORDS OF
              TRANSACTIONS INITIATED OR COMPLETED BY US OR VIA THE SITE. The
              User hereby waives any rights or requirements under any statutes,
              regulations, rules, ordinances, or other laws in any jurisdiction
              which require an original signature or delivery or retention of
              non-electronic records, or to payments or the granting of credits
              by any means other than electronic means.{' '}
            </Text>
          </ScrollView>
        </View>
      </View>

      <View style={[Styles.authSubmit, {flex: 0.5}]}>
        <View style={[Styles.textWrapView]}>
          <CheckBox
            style={[Styles.terms, Styles.singleFlex]}
            center
            title="Agreen Terms and Conditions"
            checked={check1}
            onPress={() => setCheck1(!check1)}
          />
        </View>
        <View style={[Styles.textWrapView, Styles.authSubmit]}>
          <Button
            title="Continue"
            icon={<Icon name="arrow-forward-outline" size={24} color="white" />}
            iconRight
            iconContainerStyle={{marginLeft: 50}}
            buttonStyle={Styles.buttonStyleAuth}
            containerStyle={{
              width: wp('50%'),
            }}
            disabled={!check1}
            onPress={() => register()}
          />
        </View>
      </View>
      <View style={[Styles.authSubmit, {flex: 0}]}></View>
    </View>
  );
}

export default TermNcondition;
