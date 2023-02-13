import { range } from "@ctocker/lib/build/main/src/utils";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import { Box, styled } from "@mui/system";
import BigNumber from "bignumber.js";
import React, { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import { useDebouncedCallback } from "use-debounce";

export interface RatePickerProps {
  selectedRate: string;
  scrollRows: number;
  rates: string[];
  onRateChange: (rate: string, index: number) => void;
  onSuggestedRate: (suggestedRate?: string) => void;
  pair: string | undefined;
  isLoading?: boolean;
}

function pickClosestIndex(rates: RatePickerProps["rates"], rate: RatePickerProps["selectedRate"]) {
  if (new BigNumber(rate).gt(rates[0])) return -1;
  if (new BigNumber(rate).lt(rates[rates.length - 1])) return -2;
  if (new BigNumber(rate).eq(rates[rates.length - 1])) return rates.length - 1;
  return rates.findIndex((item) => new BigNumber(rate).gte(item));
}

function pickRate(rates: RatePickerProps["rates"], rateIndex: number) {
  if (rateIndex === -1) return rates[0];
  if (rateIndex === -2) return rates[rates.length - 1];
  return rates[rateIndex];
}

const SuggestionTypography = styled(Typography)`
  cursor: pointer;
  text-decoration: underline;
  text-decoration-style: dotted;
`;

const SuggestionHint = styled(Typography)`
  position: absolute;
  right: 0;
  bottom: -0.8rem;
  font-size: 0.7rem;
`;

function Suggestion({ children, onClick }: { children: React.ReactNode; onClick: (event: React.SyntheticEvent) => void }) {
  return (
    <Box sx={{ position: "relative" }} mr={1} onClick={onClick}>
      <SuggestionTypography>{children}</SuggestionTypography>
      <SuggestionHint>suggested</SuggestionHint>
    </Box>
  );
}

function RatePicker(props: RatePickerProps) {
  const [selectedIndex, setSelectedIndex] = useState(() => pickClosestIndex(props.rates, props.selectedRate));
  const [offset, setOffset] = useState(selectedIndex || 0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastTouchY, setLastTouchY] = useState(0);
  const [suggestedRateIndex, setSuggestedRateIndex] = useState<number | undefined>();
  const suggestedRate = suggestedRateIndex !== undefined ? props.rates?.[suggestedRateIndex] : undefined;
  const [textFieldRate, setTextFieldRate] = useState(props.selectedRate);
  const textFieldOnChangeCb = (event?: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, valueArg?: string) => {
    const value = valueArg || event?.target?.value || "";
    if (value.match(/^(\d{1,}[.])?[0-9]+$/)) {
      const closestRateIndex = pickClosestIndex(props.rates, event?.target?.value || "");

      if (pickRate(props.rates, closestRateIndex) !== value) {
        setSuggestedRateIndex(() => {
          if (closestRateIndex === -1) return 0;
          if (closestRateIndex === -2) return props.rates.length - 1;
          return closestRateIndex;
        });
      } else {
        setSelectedIndex(closestRateIndex);
        setSuggestedRateIndex(undefined);
      }
    }
  };
  const debouncedTextFieldOnChange = useDebouncedCallback(textFieldOnChangeCb, 400);

  const lastIndex = props.rates.length - 1;
  const scrollRows = props.scrollRows || 3;
  const textFieldRef = useRef<null | HTMLDivElement>(null);
  const displayedRateIndecies = range(scrollRows, offset);

  useEffect(() => {
    const closestIndex = pickClosestIndex(props.rates, props.selectedRate);
    const closestRate = props.rates[closestIndex];

    setSelectedIndex(closestIndex);
    setTextFieldRate(closestRate);
  }, [props.selectedRate, props.rates]);

  useEffect(() => {
    props.onRateChange(props.rates[selectedIndex], selectedIndex);
    setSuggestedRateIndex(undefined);
  }, [selectedIndex]);

  useEffect(() => {
    props.onSuggestedRate(suggestedRate);
  }, [suggestedRate]);

  useEffect(() => {
    if (selectedIndex < 0) {
      textFieldOnChangeCb(undefined, props.selectedRate);
    }
  }, []);

  useEffect(() => {
    if (menuOpen) {
      if (selectedIndex - Math.floor(scrollRows / 2) < 0) {
        setOffset(0);
      } else if (props.rates.length - selectedIndex < Math.floor(scrollRows / 2)) {
        setOffset(props.rates.length - scrollRows);
      } else if (selectedIndex - Math.floor(scrollRows / 2) >= 0) {
        setOffset(selectedIndex - Math.floor(scrollRows / 2));
      }
    }
  }, [menuOpen, selectedIndex, scrollRows]);

  const handleWheelScroll = (event: React.WheelEvent) => {
    if (event.deltaY > 0) {
      setOffset((prev) => (prev + 1 > lastIndex - scrollRows ? lastIndex - scrollRows + 1 : prev + 1));
    } else {
      setOffset((prev) => (prev - 1 <= 0 ? 0 : prev - 1));
    }
  };

  const handleTouchScroll = (event: React.TouchEvent) => {
    if (lastTouchY > event.changedTouches[0].clientY + 5) {
      setOffset((prev) => (prev - 1 <= 0 ? 0 : prev - 1));
    } else if (lastTouchY < event.changedTouches[0].clientY - 5) {
      setOffset((prev) => (prev + 1 > lastIndex - scrollRows ? lastIndex - scrollRows + 1 : prev + 1));
    }

    setLastTouchY(event.changedTouches[0].clientY);
  };

  return (
    <Box>
      <Tooltip open={!!suggestedRate} title={`Nearest available price is ${suggestedRate}`}>
        <TextField
          disabled={props.isLoading}
          error={!!suggestedRate}
          ref={textFieldRef}
          InputProps={{
            startAdornment: <Typography sx={{ mr: 0.5, whiteSpace: "nowrap" }}>{props?.pair} = </Typography>,
            endAdornment: (
              <InputAdornment position="end">
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {suggestedRate !== undefined && suggestedRateIndex !== undefined ? (
                    <Suggestion
                      onClick={() => {
                        setSelectedIndex(suggestedRateIndex);
                        setSuggestedRateIndex(undefined);
                        setTextFieldRate(props.rates[suggestedRateIndex]);
                      }}
                    >
                      {suggestedRate}
                    </Suggestion>
                  ) : null}
                  {isMobile || props.isLoading ? null : (
                    <IconButton
                      onClick={() => {
                        if (!isMobile) {
                          setMenuOpen((prev) => !prev);
                        }
                      }}
                    >
                      {props.rates?.length ? (
                        <>
                          {menuOpen ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
                          {isMobile && (
                            <select
                              style={{ opacity: 0, position: "absolute" }}
                              onChange={(event) => {
                                setSelectedIndex(+event.target.value);
                              }}
                            >
                              {props.rates.map((rate, index) => (
                                <option key={`mobile-rate-picker-${rate}`} value={index}>
                                  {rate}
                                </option>
                              ))}
                            </select>
                          )}
                        </>
                      ) : null}
                    </IconButton>
                  )}
                </Box>
              </InputAdornment>
            ),
          }}
          label="Exchange rate"
          value={textFieldRate}
          fullWidth
          onChange={(event) => {
            const value = event.target.value;
            if (value && !value.match(/^(\d{1,}[.]{0,1})[0-9]{0,}$/)) {
              return;
            }

            setTextFieldRate(value);
            debouncedTextFieldOnChange(event);
          }}
        />
      </Tooltip>
      <Menu
        open={menuOpen}
        anchorEl={textFieldRef.current}
        onClose={() => {
          setMenuOpen(false);
        }}
        PaperProps={{
          onWheel: handleWheelScroll,
          onTouchMove: handleTouchScroll,
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          horizontal: "right",
          vertical: "center",
        }}
      >
        {Array.from(Array(scrollRows).keys()).map((index) => {
          return (
            <MenuItem
              selected={displayedRateIndecies[index] === selectedIndex}
              key={`rate-picker-menu-item-${index}`}
              onClick={() => {
                setSelectedIndex(displayedRateIndecies[index]);
                setMenuOpen(false);
              }}
            >
              {props.rates[displayedRateIndecies[index]]}
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
}

export default RatePicker;
