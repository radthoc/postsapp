<?php

interface DBHandler
{
    public function get_results($query, $params = [], $object = false);

    public function insert($table, $variables);

    public function update($table, $variables, $where, $limit = '');

    public function lastid();

    public function affected();
}