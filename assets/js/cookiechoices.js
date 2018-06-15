/*
 Copyright 2014 Google Inc. All rights reserved.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/*
 * For more information on this file, see http://www.cookiechoices.org/
 */

(function(window) {

  if (!!window.cookieChoices) {
    return window.cookieChoices;
  }

  var document = window.document;
  // IE8 does not support textContent, so we should fallback to innerText.
  var supportsTextContent = 'textContent' in document.body;

  var cookieChoices = (function() {

    var cookieName = 'displayCookieConsent';
    var cookieConsentId = 'cookieChoiceInfo';
    var divClass = 'cookie-choices-info';
    var innerDivClass = 'cookie-choices-inner';
    var textSpan = 'cookie-choices-text';
    var buttonsClass = 'cookie-choices-buttons';
    var buttonClass = 'cookie-choices-button';
    var singletonClass = 'singleton-element';
    var dismissLinkId = 'cookieChoiceDismiss';

    function _createHeaderElement(cookieText, dismissText, linkText, linkHref) {
      var cookieInnerElement = document.createElement('div');
      cookieInnerElement.className = innerDivClass;
      cookieInnerElement.appendChild(_createConsentText(cookieText));

      var buttonsElement = document.createElement('span');
      buttonsElement.className = buttonsClass;
      cookieInnerElement.appendChild(buttonsElement);

      if (!!linkText && !!linkHref) {
        buttonsElement.appendChild(_createInformationLink(linkText, linkHref));
      }

      buttonsElement.appendChild(_createDismissLink(dismissText));

      var cookieConsentElement = document.createElement('div');
      cookieConsentElement.id = cookieConsentId;
      cookieConsentElement.className = divClass + ' ' + singletonClass;
      cookieConsentElement.appendChild(cookieInnerElement);
      return cookieConsentElement;
    }

/* I've made some style changes (MariaCoding) */
    function _createStyleElement() {
      var style = document.createElement('style');
      style.className = singletonClass;
      style.type = 'text/css';
      _setElementText(style,
          '.' + divClass + ' { ' +
              'position:fixed;width:100%;background-color:rgba(14,17,17,0.8);margin:0;' +
              'left:0;top:0;z-index:4000;text-align:center;' +
              'color:#f6f6f5;line-height:145%;padding:0.5em 0;' +
              'font-family:Helvetica,Roboto,Arial,sans-serif; } ' +
          '.' + divClass + ' .' + innerDivClass + ' { ' +
              'position:relative;width:initial;margin:0;left:0;top:0; } ' +
          '.' + divClass + ' .' + textSpan + ' { ' +
              'display:inline-block;vertical-align:middle;font-size:0.85em;' +
              'margin:0.8em 1.6em;color:#f6f6f5;max-width:62.5em;' +
              'text-align:left;margin-bottom:0.5em; }' +
          '.' + divClass + ' .' + buttonsClass + ' { ' +
              'display:inline-block;vertical-align:middle;' +
              'white-space:nowrap;margin:0;margin-bottom:0.5em; } ' +
          '.' + divClass + ' .' + buttonClass + ':hover { ' +
              ' color: #f6f6f5; background-color:#1CA99F} ' +
            '.' + divClass + ' .' + buttonClass + ':focus { ' +
                ' color: #f6f6f5; background-color:#1CA99F; outline: none} ' +
          '.' + divClass + ' .' + buttonClass + ' { ' +
              'font-size:0.65em;font-weight:bold;text-transform:UPPERCASE;' +
              'white-space:nowrap;' +
              'color:#f6f6f5;margin-left:0.5em;padding:0.6em; ' +
              'text-decoration:none;border:1px solid #7f7f7f;background-color:rgba(255,255,255,0.2);border-radius:10PX;}');
      document.getElementsByTagName('head')[0].appendChild(style);
    }

    function _setElementText(element, text) {
      if (supportsTextContent) {
        element.textContent = text;
      } else {
        element.innerText = text;
      }
    }

    function _createConsentText(cookieText) {
      var consentText = document.createElement('span');
      _setElementText(consentText, cookieText);
      consentText.className = textSpan;
      return consentText;
    }

    function _createDismissLink(dismissText) {
      var dismissLink = document.createElement('a');
      _setElementText(dismissLink, dismissText);
      dismissLink.id = dismissLinkId;
      dismissLink.href = '#';
      dismissLink.className = buttonClass;
      return dismissLink;
    }

    function _createInformationLink(linkText, linkHref) {
      var infoLink = document.createElement('a');
      _setElementText(infoLink, linkText);
      infoLink.href = linkHref;
      infoLink.target = '_blank';
      infoLink.className = buttonClass;
      return infoLink;
    }

    function _dismissLinkClick(e) {
      _saveUserPreference();
      _removeCookieConsent();
      e.stopPropagation && e.stopPropagation();
      e.cancelBubble = true;
      return false;
    }

    function _showCookieConsent(cookieText, dismissText, linkText, linkHref) {
      if (_shouldDisplayConsent()) {
        _removeCookieConsent();
        _createStyleElement();
        var consentElement =
            _createHeaderElement(cookieText, dismissText, linkText, linkHref);
        var fragment = document.createDocumentFragment();
        fragment.appendChild(consentElement);
        document.body.appendChild(fragment.cloneNode(true));
        document.getElementById(dismissLinkId).onclick = _dismissLinkClick;
        document.getElementById(dismissLinkId).focus();// add by MariaCoding
      }
    }

    function _removeCookieConsent() {
      var cookieChoiceElement = document.getElementById(cookieConsentId);
      if (cookieChoiceElement != null) {
        cookieChoiceElement.parentNode.removeChild(cookieChoiceElement);
      }
    }

    function _saveUserPreference() {
      // Set the cookie expiry to one year after today.
      var expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      document.cookie = cookieName + '=y; expires=' + expiryDate.toGMTString();
    }

    function _shouldDisplayConsent() {
      // Display the header only if the cookie has not been set.
      return !document.cookie.match(new RegExp(cookieName + '=([^;]+)'));
    }

    var exports = {};
    exports.showCookieConsentBar = _showCookieConsent;
    return exports;
  })();

  window.cookieChoices = cookieChoices;
  return cookieChoices;
})(this);
