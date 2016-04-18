<?php

interface DBHandlerInterface
{
    public function getRow($query, $params = []);

    public function getResults($query, $params = []);

    public function insert($table, $variables);

    public function update($table, $variables, $where, $limit = '');

    public function lastId();

    public function affected();
}
