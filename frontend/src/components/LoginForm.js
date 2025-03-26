import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const LoginForm = () => {
    // Define validation schema using Yup
    const validationSchema = Yup.object({
        email: Yup.string()
            .email("Invalid email format")
            .required("Email is required"),
        password: Yup.string()
            .min(6, "Password must be at least 6 characters")
            .required("Password is required"),
    });

    return (
        <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
                console.log("Login Data:", values);
                setSubmitting(false);
            }}
        >
            {({ isSubmitting }) => (
                <Form className="max-w-md mx-auto p-4 border rounded shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Login</h2>

                    {/* Email Field */}
                    <div className="mb-4">
                        <label htmlFor="email" className="block font-medium">
                            Email:
                        </label>
                        <Field
                            type="email"
                            name="email"
                            className="w-full p-2 border rounded"
                        />
                        <ErrorMessage
                            name="email"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                        />
                    </div>

                    {/* Password Field */}
                    <div className="mb-4">
                        <label htmlFor="password" className="block font-medium">
                            Password:
                        </label>
                        <Field
                            type="password"
                            name="password"
                            className="w-full p-2 border rounded"
                        />
                        <ErrorMessage
                            name="password"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Logging in..." : "Login"}
                    </button>
                </Form>
            )}
        </Formik>
    );
};

export default LoginForm;

