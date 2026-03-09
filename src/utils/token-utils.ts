import Cookies from 'js-cookie';

interface Token {
  authorization: string;
  sessionid: string;
}
export const token: Token = {
  authorization: 'Bearer ' + Cookies.get('token')!,
  sessionid: Cookies.get('sessionid')!,
};
