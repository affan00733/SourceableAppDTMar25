import {StyleSheet, Dimensions} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleOnboarding: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: hp('3%'),
    textAlign: 'center',

    flexWrap: 'wrap',
  },
  textWrapView: {
    flexDirection: 'row',
  },
  main: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    flex: 3,
    borderWidth: 2,
    borderColor: '#3498DB',
    borderRadius: hp('100%'),
    justifyContent: 'center',
    height: hp('20%'),
    width: wp('65%'),
    alignItems: 'center',
    margin: hp('10%'),
  },
  imageLogo: {
    height: hp('5%'),
    width: wp('70%'),
  },

  footerButton: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  footerOnboarding: {
    color: 'blue',
    fontSize: hp('2%'),
    textAlign: 'center',
  },
  singleFlex: {
    flex: 1,
  },
  onboardingTitle: {
    color: 'grey',
    fontWeight: 'bold',
    fontSize: hp('2.5%'),
    textAlign: 'center',
    flexWrap: 'wrap',
    marginLeft: hp('1.24%'),
    marginRight: hp('1.24%'),
  },
  onboardingDescription: {
    color: 'black',
    fontSize: hp('2.5%'),
    textAlign: 'center',
    flexWrap: 'wrap',
    marginLeft: hp('1.24%'),
    marginRight: hp('1.24%'),
  },
  twoFlex: {
    flex: 2,
  },
  threeFlex: {
    flex: 3,
  },
  onboardingButton: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    width: wp('100%'),
  },
  inputBox: {
    width: wp('90%'),
    height: hp('7%'),

    backgroundColor: '#D5DBDB',
    marginBottom: hp('2%'),
    borderRadius: hp('10%'),
  },
  authSubmit: {alignItems: 'center'},
  buttonStyleAuth: {
    backgroundColor: 'grey',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: wp('100%'),
  },
  authFooter: {
    flex: 1,
    color: 'black',
    flexWrap: 'wrap',
    textAlign: 'center',
  },
  footerAuthButton: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  terms: {
    color: 'black',
    fontSize: hp('2%'),
    textAlign: 'justify',
    margin: hp('1.5%'),
    flexWrap: 'wrap',
  },
  tabBar: {
    height: 70,
    position: 'absolute',
    bottom: 16,
    right: 16,
    left: 16,
    borderRadius: 16,
    backgroundColor: '#CACFD2',
  },
  btn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 4,
    borderColor: '#CACFD2',
    backgroundColor: '#CACFD2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#CACFD2',
    borderRadius: 25,
  },
  text: {
    fontSize: 10,
    textAlign: 'center',
    color: 'black',
  },
  headerView: {
    flexDirection: 'row',
  },
  headerBtn: {
    backgroundColor: '#E5EAED',
    margin: hp('1%'),
    borderRadius: hp('1.5%'),
    padding: hp('0.9%'),
    height: hp('5.5%'),
  },
  topTab: {
    marginTop: hp('7%'),
    marginLeft: hp('2%'),
    marginRight: hp('2%'),
    borderRadius: hp('6%'),
    backgroundColor: 'white',
    borderColor: 'grey',
    borderWidth: hp('0.15%'),
    height: hp('6%'),
  },
  topTabBar: {
    backgroundColor: '#CACFD2',
    height: hp('6%'),
    borderColor: 'grey',
    borderRadius: hp('6%'),
  },
  galleryContainer: {
    flex: 1,
    marginVertical: hp('2%'),
  },
  galleryItem: {
    borderColor: '#B3B6B7',
    borderWidth: hp('0.2%'),
    borderRadius: hp('2%'),
    backgroundColor: '#ECF0F1',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: hp('0.5%'),
    height: wp('30%'), // approximate a square
  },
  galleryItemInvisible: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  galleryItemText: {
    color: '#B3B6B7',
  },
  cloudLock: {
    margin: hp('0.5%'),
    position: 'absolute',
    top: hp('6%'),
    right: hp('6%'),
    color: 'black',
  },
  cloudOther: {
    margin: hp('0.8%'),
    position: 'absolute',
    top: hp('6%'),
    right: hp('6%'),
    color: 'black',
  },
  settingText: {
    color: 'black',
    fontSize: hp('2.3%'),
    marginLeft: hp('3%'),
    flexWrap: 'wrap',
  },
  settingDivider: {
    flex: 10,
    margin: hp('2.5%'),
  },
  aboutText: {
    color: 'black',
    fontSize: hp('2.3%'),
    margin: hp('3%'),
    flexWrap: 'wrap',
  },
  contactText: {
    color: 'black',
    fontSize: hp('1.8%'),
    flexWrap: 'wrap',
    textAlign: 'justify',
  },
});

export default styles;
