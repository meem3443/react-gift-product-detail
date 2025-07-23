import { useReducer, useCallback } from "react";

// 액션 타입 정의
type InputActionType = "INPUT" | "BLUR" | "RESET" | "SET_VALUE" | "SET_TOUCHED"; // SET_VALUE, SET_TOUCHED 추가

// 액션 인터페이스 정의
interface InputAction {
  type: InputActionType;
  value?: string;
  isTouched?: boolean; // isTouched 필드 추가
}

// 상태 인터페이스 정의
interface InputState {
  value: string;
  isTouched: boolean;
  isValid: boolean;
}

// 유효성 검사 함수 타입 정의
type Validator = (value: string) => string; // 에러 메시지를 반환하거나, 유효하면 빈 문자열 반환

// 리듀서 함수
const inputStateReducer = (
  state: InputState,
  action: InputAction
): InputState => {
  switch (action.type) {
    case "INPUT":
      return {
        ...state, // 나머지 상태 유지
        value: action.value || "",
      };
    case "BLUR":
      return {
        ...state, // 나머지 상태 유지
        isTouched: true,
      };
    case "RESET":
      return {
        value: "",
        isTouched: false,
        isValid: false,
      };
    case "SET_VALUE": // SET_VALUE 액션 추가
      return {
        ...state,
        value: action.value || "",
      };
    case "SET_TOUCHED": // SET_TOUCHED 액션 추가
      return {
        ...state,
        isTouched: action.isTouched ?? true, // 값이 없으면 true로 설정
      };
    default:
      return state;
  }
};

/**
 * 사용자 입력 필드를 관리하고 유효성 검사를 수행하는 커스텀 훅
 * @param initialValue 초기 입력 값
 * @param validator 유효성 검사 함수. 문자열을 받아 에러 메시지를 반환하거나, 유효하면 빈 문자열을 반환합니다.
 * @returns {Object} 입력 필드 관련 상태와 핸들러
 * - value: 현재 입력 값
 * - error: 유효성 검사 에러 메시지 (유효하면 빈 문자열)
 * - touched: 사용자가 입력 필드를 건드렸는지 여부
 * - isValid: 현재 입력 값이 유효한지 여부
 * - onChange: input/textarea의 onChange 핸들러
 * - onBlur: input/textarea의 onBlur 핸들러
 * - reset: 입력 필드를 초기화하는 함수
 * - setValue: 외부에서 value를 직접 설정하는 함수
 * - setTouched: 외부에서 touched 상태를 직접 설정하는 함수
 */
export const useInput = (initialValue: string, validator: Validator) => {
  const [inputState, dispatch] = useReducer(inputStateReducer, {
    value: initialValue,
    isTouched: false,
    isValid: false, // isValid는 리듀서 밖에서 계산
  });

  const error = validator(inputState.value);
  const isValid = !error; // 에러 메시지가 없으면 유효함

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      dispatch({ type: "INPUT", value: event.target.value });
    },
    []
  );

  const onBlur = useCallback(() => {
    dispatch({ type: "BLUR" });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  // 외부에서 값을 직접 설정할 수 있는 함수
  const setValue = useCallback((newValue: string) => {
    dispatch({ type: "SET_VALUE", value: newValue });
  }, []);

  // 외부에서 touched 상태를 직접 설정할 수 있는 함수
  const setTouched = useCallback((isTouched: boolean) => {
    dispatch({ type: "SET_TOUCHED", isTouched });
  }, []);

  return {
    value: inputState.value,
    error,
    touched: inputState.isTouched,
    isValid,
    onChange,
    onBlur,
    reset,
    setValue,
    setTouched,
  };
};
