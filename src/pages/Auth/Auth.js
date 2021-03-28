import React, { useEffect, useState } from "react";
import { NavLink, Redirect } from "react-router-dom";
import { useFormik } from "formik";
import Header from "../../components/Header";
import NextIcon from "../../img/next.svg";
import SuccessIcon from "../../img/check.svg";
import "./Auth.scss";
import { countries } from "../../constants/constants";

export default (props) => {
  const {isDeliveryPage, isPaymentPage, isPaymentSuccessful} = props;

  const [redirectToPayment, setRedirectToPayment] = useState(false);
  const [redirectToSuccessfulPayment, setRedirectToSuccessfulPayment] = useState(false);

  useEffect(() => {
    const cardNumber = document.getElementById("cardNumber"),
          cardTerm = document.getElementById("cardTime");

    if (isPaymentPage) {
      cardNumber.addEventListener("keyup", function(e) {
        let val = cardNumber.value,
            newVal = "";
        val = val.replace(/\s/g, "");
    
        for (let i = 0; i < val.length; i++) {
          if (i % 4 == 0 && i > 0) {
            newVal = newVal.concat(" ");
          }
          newVal = newVal.concat(val[i]);
        }
  
        cardNumber.value = newVal;
      });

      cardTerm.addEventListener("keyup", function(e) {
        let val = cardTerm.value,
            newVal = "";
        val = val.replace(/\s+|[\/]/g, "");
        
        for (let i = 0; i < val.length; i++) {
          if (i == 2) {
            newVal = newVal.concat(" / ");
          }
          newVal = newVal.concat(val[i]);
        }

        cardTerm.value = newVal;
      });
    }
  }, []);

  const validate = values => {
    const errors = {};

    if (isDeliveryPage) {
      if (!values.name) {
        errors.name = "Поле ФИО обязательно к вводу.";
      } else {
        let regExp = /^([А-ЯA-Z]|[А-ЯA-Z][\x27а-яa-z]{1,}|[А-ЯA-Z][\x27а-яa-z]{1,}\-([А-ЯA-Z][\x27а-яa-z]{1,}|(оглы)|(кызы)))\040[А-ЯA-Z][\x27а-яa-z]{1,}(\040[А-ЯA-Z][\x27а-яa-z]{1,})?$/;
        if (!regExp.test(values.name)) {
          errors.name = "Неверно указаны параметры ФИО.";
        }
      }
    
      if (!values.city) {
        errors.city = "Укажите город.";
      } else if (values.city.length > 20) {
        errors.city = "Неверно указан город";
      }
    
      if (!values.address) {
        errors.address = "Укажите адрес.";
      } else if (values.address.length > 120) {
        errors.address = "Укажите верный адрес.";
      }
  
      if (!values.index) {
        errors.index = "Введите индекс.";
      } else {
        let regExp = /\d{6}/;
        if (!regExp.test(values.index)) {
          errors.index = "Укажите верный почтовый индекс";
        }
      }
  
      if (!values.country) {
        errors.country = "Укажите страну.";
      }
    }

    else if (isPaymentPage) {
      if (!values.cardName) {
        errors.cardName = "Введите держателя карты.";
      } else {
        let regExp = /([a-zA-Z]{3,30}\s*)+/;
        if (!regExp.test(values.cardName)) {
          errors.cardName = "Введите корректные данные";
        }
      }
  
      if (!values.cardNumber) {
        errors.cardNumber = "Введите номер карты.";
      } else {
        let regExp = /[0-9]{20}$/;
        if (!regExp.test(values.cardNumber.split(" ").join(""))) {
          errors.cardNumber = "Введите корректный номер карты";
        }
      }

      if (!values.cardTime) {
        errors.cardTime = "Введите срок службы Вашей карты.";
      } else {
        let month = values.cardTime.substr(0, 2),
            year = values.cardTime.substr(2),
            currentDate = new Date(),
            currentMonth  = currentDate.getMonth(),
            currentYear = Number(currentDate.getFullYear().toString().substr(2));
        if (month > 12 || month < 1) {
          errors.cardTime = "Неверный срок службы карты."; 
        } else if (currentMonth > month && currentYear > year || currentYear > year) {
          errors.cardTime = "Ваша карта просрочена";
        }
      }
  
      if (!values.cardCVV) {
        errors.cardCVV = "Введите CVV-код";
      } else {
        let regExp = /[0-9]{3,10}$/;
        if (!regExp.test(values.cardCVV.split(" ").join(""))) {
          errors.cardCVV = "Введите правильный CVV";
        }
      }
    } 

    return errors;
  };
  
  const formik = useFormik({
    initialValues: isDeliveryPage ? {
      name: "",
      city: "",
      address: "",
      country: undefined,
      index: ""
    } : {
      cardName: "",
      cardNumber: "",
      cardTime: "",
      cardCVV: ""
    },
    validate,
    onSubmit: () => {
      if (isDeliveryPage) {
        setRedirectToPayment(true);
      }
      else {
        setRedirectToSuccessfulPayment(true);
      }
    },
  });
  
  if (redirectToPayment && isDeliveryPage) {
    return <Redirect from = "/order/delivery" to = {{
      pathname: "/order/payment",
      state: {
        key: "123"
      }
    }}></Redirect>
  }

  if (redirectToSuccessfulPayment && isPaymentPage) {
    return <Redirect from = "/order/payment" to = {{
      pathname: "/order/payment/successful",
      state: {
        key: "456"
      }
    }}></Redirect>
  }

  if (isDeliveryPage) {
    return(
      <>
        <Header />
        <main className = "auth__main">
          <section className = "auth__form authForm__wrapper">
            <div className = "authForm__tracker">
              <NavLink className = "authForm__navtext" activeClassName = "authForm__navtext_active" to = "delivery">Доставка</NavLink>
              <div className = "authForm__nextIcon">
                <NextIcon />
              </div>
              <span className = "authForm__navtext">Оплата</span>
            </div>
            <h2 className = "authForm__header">
              Информация для доставки
            </h2>
            <form className = "authForm__form" onSubmit={(e) => {
              e.preventDefault(); 
              formik.handleSubmit(e)}         
            }>
              <label className = "authForm__label" htmlFor="name">Получатель</label>
              <input
                id="name"
                name="name"
                type="text"
                className = {formik.touched.name && formik.errors.name ? "authForm__input authForm__input_error authForm__input_first" : "authForm__input authForm__input_first"}
                placeholder = "ФИО"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
              />

              <label className = "authForm__label" htmlFor="city">Адрес</label>
              <input
                id="city"
                name="city"
                type="text"
                className = {formik.touched.city && formik.errors.city ? "authForm__input authForm__input_error" : "authForm__input"}
                placeholder = "Город"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.city}
              />

              <input
                id="address"
                name="address"
                type="text"
                className = {formik.touched.address && formik.errors.address ? "authForm__input authForm__input_error" : "authForm__input"}
                placeholder = "Адрес"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.address}
              />

              <div className = "authForm__additional">
                <select
                  id="country"
                  name="country"
                  className = {formik.touched.country && formik.errors.country ? "authForm__select authForm__input authForm__input_error" : "authForm__select authForm__input"}
                  defaultValue = "default"
                  placeholder = "Страна"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.country}
                >
                  <option value="default" disabled>Страна</option>
                  {countries.map((curr, index) => {
                    return <option key = {index} value = {curr}>{curr}</option>
                  })} 
                </select>
                
                <input
                  id="index"
                  name="index"
                  type="text"
                  className = {formik.touched.index && formik.errors.index ? "authForm__input authForm__input_error" : "authForm__input"}
                  placeholder = "Индекс"
                  style = {{width: "50%"}}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.index}
                />
              </div>
              <button className = "authForm__submitBtn" type="submit">Продолжить</button>
            </form>
          </section>
        </main>
      </>
    )
  }

  else if (isPaymentPage) {
    return (
      <>
        <Header />
        <main className = "auth__main">
          <section className = "auth__form authForm__wrapper">
            <div className = "authForm__tracker">
              <NavLink className = "authForm__navtext" activeClassName = "authForm__navtext_active" to = "delivery">Доставка</NavLink>
              <div className = "authForm__nextIcon">
                <NextIcon />
              </div>
              <NavLink to = "payment" className = "authForm__navtext" activeClassName = "authForm__navtext_active">Оплата</NavLink>
            </div>
            <h2 className = "authForm__header">
              Оплата
            </h2>
            <form className = "authForm__form" onSubmit={(e) => {
              e.preventDefault(); 
              formik.handleSubmit(e)}         
            }>
              <label className = "authForm__label" htmlFor="cardName">Имя на карте</label>
              <input
                id="cardName"
                name="cardName"
                type="text"
                className = {formik.touched.cardName && formik.errors.cardName ? "authForm__input_payment authForm__input authForm__input_error" : "authForm__input_payment authForm__input"}
                placeholder = "Konstantin Ivanov"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.cardName}
              />

              <label className = "authForm__label" htmlFor="cardNumber">Номер карты</label>
              <input
                id="cardNumber"
                name="cardNumber"
                maxLength = {24}
                type="text"
                className = {formik.touched.cardNumber && formik.errors.cardNumber ? "authForm__input_payment authForm__input authForm__input_error" : "authForm__input_payment authForm__input"}
                placeholder = "XXXX XXXX XXXX XXXX XXXX"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.cardNumber}
              />
              <div className = "authForm__additional authAdditional">
                <div className = "authAdditional__item">
                  <label className = "authForm__label" htmlFor="cardTime">Срок</label>
                  <input
                    id="cardTime"
                    name="cardTime"
                    type="text"
                    className = {formik.touched.cardTime && formik.errors.cardTime ? "authForm__input_payment authForm__input authForm__input_error" : "authForm__input_payment authForm__input"}
                    placeholder = "MM / YY"
                    size = {6}
                    maxLength = {7}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.cardTime}
                  />
                </div>
                <div className = "authAdditional__item">
                  <label className = "authForm__label" htmlFor="cardCVV">CVV</label>
                  <input
                    id="cardCVV"
                    name="cardCVV"
                    type="text"
                    className = {formik.touched.cardCVV && formik.errors.cardCVV ? "authForm__input_payment authForm__input authForm__input_error" : "authForm__input_payment authForm__input"}
                    placeholder = ""
                    size = {4}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.cardCVV}
                  />
                </div>
              </div>
              <button className = "authForm__submitBtn" type="submit">Оплатить</button>
            </form>
          </section>
        </main>
      </>
    )
  }

  else if (isPaymentSuccessful) {
    return (
      <>
        <Header />
        <main className = "auth__main">
          <section className = "auth__form authForm__wrapper authForm__wrapper_successful">
            <div className = "authForm__success authFormSuccess">
              <div className = "authFormSuccess__svg">
                <SuccessIcon />
              </div>
              <span className = "authFormSuccess__text">
                Спасибо!
              </span>
            </div>
          </section>
        </main>
      </>
    )
  }
  else {
    return (
      <div>Ошибка</div>
    )
  }
}