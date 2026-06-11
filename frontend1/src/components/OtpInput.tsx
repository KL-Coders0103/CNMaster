import React, {
  useEffect,
  useRef,
} from "react";

import {
  TextInput,
  View,
} from "react-native";

import {
  otpInputStyles,
} from "../styles/components/otpInputStyles";

type Props = {
  value: string;

  onChange: (
    otp: string
  ) => void;

  length?: number;
};

const OtpInput = ({
  value,
  onChange,
  length = 6,
}: Props) => {
  const inputRefs =
    useRef<
      TextInput[]
    >([]);

  useEffect(() => {
    if (
      value.length === 1
    ) {
      inputRefs.current[0]?.focus();
    }
  }, []);

  const handleChange =
    (
      text: string,
      index: number
    ) => {
      if (
        text.length > 1
      ) {
        const pasted =
          text
            .replace(
              /\D/g,
              ""
            )
            .slice(
              0,
              length
            );

        onChange(
          pasted
        );

        inputRefs
          .current[
            Math.min(
              pasted.length,
              length
            ) - 1
          ]
          ?.focus();

        return;
      }

      const otp =
        value
          .split("");

      otp[index] =
        text;

      const finalOtp =
        otp.join("");

      onChange(
        finalOtp
      );

      if (
        text &&
        index <
          length -
            1
      ) {
        inputRefs
          .current[
            index +
              1
          ]
          ?.focus();
      }
    };

  const handleBackspace =
    (
      text: string,
      index: number
    ) => {
      if (
        text === "" &&
        index > 0
      ) {
        inputRefs
          .current[
            index - 1
          ]
          ?.focus();
      }
    };

  return (
    <View
      style={
        otpInputStyles.container
      }
    >
      {Array.from({
        length,
      }).map(
        (
          _,
          index
        ) => (
          <TextInput
            key={
              index
            }
            ref={(
              ref
            ) => {
              if (
                ref
              ) {
                inputRefs.current[
                  index
                ] = ref;
              }
            }}
            value={
              value[
                index
              ] ??
              ""
            }
            onChangeText={(
              text
            ) =>
              handleChange(
                text,
                index
              )
            }
            onKeyPress={(
              e
            ) => {
              if (
                e
                  .nativeEvent
                  .key ===
                "Backspace"
              ) {
                handleBackspace(
                  value[
                    index
                  ],
                  index
                );
              }
            }}
            keyboardType="number-pad"
            maxLength={
              6
            }
            style={
              otpInputStyles.input
            }
          />
        )
      )}
    </View>
  );
};

export default OtpInput;