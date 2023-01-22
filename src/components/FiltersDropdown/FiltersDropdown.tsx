/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Popover,
  Slider,
  TextField,
  Typography,
} from '@mui/material';
import { applyButton, popover } from './styles';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { filesize } from 'filesize';
import { FIFTY_MB } from '@constants/common';
import { useAppDispatch } from '@store';
import { filtersSelector, setFilesFilters } from '@store/slices/files.slice';
import { FileFilters } from '@interfaces/storage/file-filters.interface';
import { useSelector } from 'react-redux';

interface FiltersValues {
  dateFrom: Dayjs | null;
  dateTo: Dayjs | null;
  sizeFrom: number;
  sizeTo: number;
}

interface FiltersDropdownProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
}

function FiltersDropdown({ anchorEl, onClose }: FiltersDropdownProps) {
  const dispatch = useAppDispatch();
  const fileFilters = useSelector(filtersSelector);

  const [filters, setFilters] = useState<FiltersValues>({
    dateFrom: fileFilters.dateFrom ? dayjs(fileFilters.dateFrom) : null,
    dateTo: fileFilters.dateTo ? dayjs(fileFilters.dateTo) : null,
    sizeFrom: fileFilters.sizeFrom,
    sizeTo: fileFilters.sizeTo,
  });

  const { dateFrom, dateTo, sizeFrom, sizeTo } = filters;

  const setFilter = (
    name: keyof FiltersValues,
    value: FiltersValues[keyof FiltersValues],
  ) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSizeRangeChange = (e: Event, values: number | number[]) => {
    const [from, to] = values as number[];
    setFilter('sizeFrom', from);
    setFilter('sizeTo', to);
  };

  const handleApplyClick = () => {
    onClose();

    const mappedFilters: Partial<FileFilters> = {
      sizeFrom,
      sizeTo,
    };

    if (dateFrom) {
      mappedFilters.dateFrom = dateFrom.toISOString();
    }

    if (dateTo) {
      mappedFilters.dateTo = dateTo.toISOString();
    }

    dispatch(setFilesFilters(mappedFilters));
  };

  const applyDisabled = dateFrom?.isAfter(dateTo);

  return (
    <Popover
      css={popover}
      onClose={onClose}
      open={!!anchorEl}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <DatePicker
            value={dateFrom}
            onChange={(value) => {
              setFilter('dateFrom', value as Dayjs);
            }}
            label="Date from"
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </Grid>
        <Grid item xs={12}>
          <DatePicker
            minDate={dateFrom}
            label="Date to"
            value={dateTo}
            onChange={(value) => {
              setFilter('dateTo', value as Dayjs);
            }}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography gutterBottom>
            Size range: {filesize(sizeFrom) as string} -{' '}
            {filesize(sizeTo) as string}
          </Typography>
          <Box px={2} mt={2}>
            <Slider
              min={0}
              step={10000}
              max={FIFTY_MB}
              value={[sizeFrom, sizeTo]}
              onChange={handleSizeRangeChange}
              valueLabelDisplay="off"
            />
          </Box>
        </Grid>
      </Grid>
      <Button
        variant="contained"
        disableElevation
        css={applyButton}
        onClick={handleApplyClick}
        disabled={applyDisabled}
      >
        Apply
      </Button>
    </Popover>
  );
}

export default FiltersDropdown;
