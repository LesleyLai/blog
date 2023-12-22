import { graphql } from "gatsby";
import * as React from "react";
import styled from "styled-components";

import { TagItem } from "../types/tags";
import Layout from "../components/layout";
import { Language, translations } from "../utils/translations";

import SEO from "../components/seo";

import { withFormik, FormikProps, ErrorMessage, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";

interface ContactProps {
  readonly children: React.ReactNode;
  readonly title: string;
  readonly date: string;
}

interface ContactProps {
  data: {
    posts: {
      tags: TagItem[];
      totalCount: number;
    };
  };
  location: {
    pathname: string;
  };
  pageContext: { lang: Language };
}

interface FormValues {
  name: string;
  email: string;
  message: string;
  website?: string;
}

const Form = styled.form`
  max-width: 600px;
  margin: 0 auto;
  display: block;
`;

interface InputStyleProps {
  isError: boolean;
}

const InputMixin = `
  width: 100%;
  border: 1px solid #aaa;
  border-radius: 3px;
  background: #FFF;
  margin: 0 0 5px;
  padding: 10px;

  :hover {
  transition: border-color 0.3s ease-in-out;
  border: 1px solid #666;
  }

  :focus {
  outline: none;
  border: 3px solid #2dabf9;
  box-shadow: 0px 0px 2px #95d5fc inset;
  }
`;

const InputErrorMixin = `
  outline: none;
  border: 1px solid #DC708F;
  box-shadow: 0px 0px 2px #EAA9BB inset;

  :hover {
  border: 1px solid #C51245;
  }
`;

const Input = styled.input<InputStyleProps>`
  ${InputMixin}
  ${props => props.isError && InputErrorMixin}
`;

const TextArea = styled.textarea<InputStyleProps>`
  ${InputMixin}
  resize: vertical;
  height: 200px;
  ${props => props.isError && InputErrorMixin}
`;

const Label = styled.label`
  font-family: "Open Sans Condensed", Helvetica, sans-serif;
  font-weight: bold;
  font-size: 0.875em;
  color: #000000;
  line-height: 1.3em;
  margin: 10px 0 5px 0;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 15px 40px;
  color: #fff;
  border: 0;
  border-radius: 3px;
  background: #2dabf9;
  font-size: 16px;
  text-transform: uppercase;
  margin: 7px 0;
  cursor: pointer;

  :hover {
    background-color: #0688fa;
  }
`;

const StyledErrorMessageWrapper = styled.div``;

const StyledErrorMessage = styled(ErrorMessage)`
  color: #ffffff;
  background: #c51244;
  padding: 3px;
  border-radius: 4px;
  position: relative;
  display: inline-block;
  box-shadow: 1px 1px 1px #aaaaaa;
  float: right;
  font-size: 12px;
  font-weight: 700;

  :before {
    content: "";
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 5px solid #c51244;
    position: absolute;
    top: -5px;
    left: 10px;
  }

  :after {
    color: #c51244;
  }
`;

const MyErrorMessage = ({ name }: { name: string }) => (
  <StyledErrorMessageWrapper>
    <StyledErrorMessage component="div" name={name} />
  </StyledErrorMessageWrapper>
);

const InnerForm = (props: FormikProps<FormValues> & { lang: Language }) => {
  const {
    lang,
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
    isSubmitting,
  } = props;

  const translated = translations[lang];

  return (
    <Form
      onSubmit={handleSubmit}
      onReset={handleReset}
      data-netlify-honeypot="bot-field"
      data-netlify="true"
      name="contact"
    >
      <input type="hidden" name="bot-field" />
      <input type="hidden" name="form-name" value="contact" />

      <Label htmlFor="name">{translated["name"]} (*)</Label>

      <Input
        width={50}
        type="text"
        name="name"
        id="name"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.name}
        placeholder={translated["name"]}
        required
        isError={!!(touched.name && errors.name)}
      />
      <MyErrorMessage name="name" />

      <Label htmlFor="email">{translated["email"]} (*)</Label>
      <Input
        width={50}
        id="email"
        type="email"
        name="email"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.email}
        placeholder={translated["email"]}
        required
        isError={!!(touched.email && errors.email)}
      />
      <MyErrorMessage name="email" />

      <Label htmlFor="website">{translated["website"]}</Label>
      <Input
        width={50}
        id="website"
        type="url"
        name="website"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.website}
        placeholder={translated["contact_form_website_placeholder"]}
        isError={!!(touched.website && errors.website)}
      />
      <MyErrorMessage name="website" />

      <Label htmlFor="message">{translated["contact_form_message"]} (*)</Label>
      <TextArea
        name="message"
        id="message"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.message}
        placeholder={translated["contact_form_message_placeholder"]}
        required
        isError={!!(touched.message && errors.message)}
      />
      <MyErrorMessage name="message" />

      <SubmitButton
        type="submit"
        disabled={
          isSubmitting ||
          !!(errors.name && touched.name) ||
          !!(errors.email && touched.email) ||
          !!errors.website ||
          !!(errors.message && touched.message)
        }
      >
        {translated["submit"]}
      </SubmitButton>
    </Form>
  );
};

const encode = (data: object) => {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key as keyof typeof data]))
    .join("&");
};

const ContactForm = (props: { lang: Language }) => {
  const lang = props.lang;
  const translated = translations[lang];

  const initialValues = {
    name: "",
    email: "",
    website: "",
    message: "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(translated["contact_validation_require_name"]),
    email: Yup.string()
      .email(translated["contact_validation_invalid_email"])
      .required(translated["contact_validation_require_email"]),
    website: Yup.string().url(translated["contact_validation_invalid_website"]),
    message: Yup.string().required(translated["contact_validation_require_message"]),
  });

  const handleSubmit = (
    data: FormValues,
    { resetForm, setSubmitting }: FormikHelpers<FormValues>
  ) => {
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encode({
        "form-name": "contact",
        ...data,
      }),
    })
      .then(() => {
        setSubmitting(false);
        resetForm();
        alert(translated["contact_submitted_message"]);
      })
      .catch(err => {
        alert(err);
      });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {formikProps => <InnerForm {...formikProps} lang={lang} />}
    </Formik>
  );
};

const ContactPage = ({ data, location, pageContext }: ContactProps) => {
  const lang = pageContext.lang;

  const pageDescription = translations[lang]["contact_page_desc"];
  const contactLocale = translations[lang]["contact"];

  return (
    <Layout
      location={location}
      lang={lang}
      tags={data.posts.tags}
      postsTotalCount={data.posts.totalCount}
    >
      <SEO
        title={contactLocale}
        lang={lang}
        description={pageDescription}
        path={location.pathname}
      />
      <h1>{pageDescription}</h1>
      {translations[lang]["contact_page_text"]}
      <ContactForm lang={lang} />
    </Layout>
  );
};

export default ContactPage;

export const query = graphql`
  query ContactQuery($lang: String!) {
    posts: allMdx(
      filter: {
        fileAbsolutePath: { regex: "//contents/blog//" }
        frontmatter: { lang: { eq: $lang } }
      }
    ) {
      totalCount
      ...Tags
    }
  }
`;
