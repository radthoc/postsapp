<?php

interface DBHandlerInterface
{
    public function get_row($query, $params = []);

    public function get_results($query, $params = []);

    public function insert($table, $variables);

    public function update($table, $variables, $where, $limit = '');

    public function lastId();

    public function affected();
}
