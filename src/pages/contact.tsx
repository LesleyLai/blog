import { graphql } from "gatsby";
import * as React from "react";
import styled from "styled-components";

import { TagItem } from "../types/tags";
import Layout from "../components/layout";
import { Language, translations } from "../utils/translations";

import SEO from "../components/seo";

import { withFormik, FormikProps, ErrorMessage } from "formik";
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

const InnerForm = (props: FormikProps<FormValues>) => {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
    isSubmitting,
  } = props;

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

      <Label htmlFor="name">Name (*)</Label>

      <Input
        width={50}
        type="text"
        name="name"
        id="name"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.name}
        placeholder="Name"
        required
        isError={!!(touched.name && errors.name)}
      />
      <MyErrorMessage name="name" />

      <Label htmlFor="email">Email (*)</Label>
      <Input
        width={50}
        id="email"
        type="email"
        name="email"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.email}
        placeholder="Email"
        required
        isError={!!(touched.email && errors.email)}
      />
      <MyErrorMessage name="email" />

      <Label htmlFor="website">Website</Label>
      <Input
        width={50}
        id="website"
        type="url"
        name="website"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.website}
        placeholder="Your website (optional)"
        isError={!!(touched.website && errors.website)}
      />
      <MyErrorMessage name="website" />

      <Label htmlFor="message">Message (*)</Label>
      <TextArea
        name="message"
        id="message"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.message}
        placeholder="Type your message here..."
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
        Submit
      </SubmitButton>
    </Form>
  );
};

const encode = (data: object) => {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key as keyof typeof data]))
    .join("&");
};

const ContactForm = withFormik<{}, FormValues>({
  mapPropsToValues: _ => ({
    name: "",
    email: "",
    website: "",
    message: "",
  }),

  validationSchema: Yup.object().shape({
    name: Yup.string().required("Please enter your name"),
    email: Yup.string()
      .email("Please enter a valid Email")
      .required("Please enter an email"),
    website: Yup.string().url("Please enter a valid url (or leave this field blank)"),
    message: Yup.string().required("Please enter your message"),
  }),

  handleSubmit(data: FormValues, { setSubmitting }) {
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
      })
      .catch(err => {
        alert(err);
      });
  },
})(InnerForm);

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
      <h1>Contact Me</h1>
      <p>
        You can direct message me on <a href="https://twitter.com/LesleyLai6">Twitter</a>. I also
        hang out in <a href="https://www.includecpp.org/discord/">#include ＜C++＞</a> and the{" "}
        <a href="https://discord.gg/6mgNGk7">Graphics Programming Discord</a> servers. And you can
        message me if you are a member of either of those servers.
      </p>
      <p>
        You can also send an email to{" "}
        <a href="mailto:lesley@lesleylai.info?subject=Hello Lesley">lesley@lesleylai.info</a> or use
        the following contact form:
      </p>
      <ContactForm />
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
